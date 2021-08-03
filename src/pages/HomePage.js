import React, { useState, useEffect } from "react"
import Konva from "konva"
import { SketchPicker } from "react-color"
import randInt from 'random-int'

import { shapeKinds, isKindOfLine, hasStroke } from "../canvas"
import { newRectangle } from "../canvas/Rectangle"
// import { MyCircle as Circle, newCircle } from "../canvas/Circle"
// import { MyImage, newImage } from "../canvas/Images"
// import { TextNode, newTextNode } from "../canvas/TextNode"
// import { newArrow, Arrow } from "../canvas/Arrow"
// import { newSimpleLine, SimpleLine } from "../canvas/SimpleLine"
// import { StraghtLine, newStraghtLine } from "../canvas/StraightLine"
// import { CustomLine, newCustomLine } from "../canvas/CustomLine"

import { MyVerticallyCenteredModal } from "../UI/MyVerticallyCenteredModal"
import { ColorPreview } from "../UI/ColorPreview"
import CustomSearchbar from "../UI/CustomSearchbar"

import { removeInArray, replaceInArray, cleanArray, addToArray, arraysEqual } from "../utils/array"
import { removeInSet, addToSet, setHasParamsAnd, setHasParamsOr } from "../utils/set"
import { pointsDistance, prettyFloatNumber } from "../utils/math"
import { downloadURI } from "../utils/other"
import {
  Paper, TextField, Slider, Typography,
  Select, MenuItem,
} from "@material-ui/core"

import {
  CropDin as RectangleIcon,
  RadioButtonUnchecked as CircleIcon,
  Forward as ArrowIcon,
  Remove as LineIcon,
  InsertPhoto as ImageIcon,
  Gesture as JamBoardIcon,
  Save as SaveIcon,
  Wallpaper as BackgroundIcon,
  Close as CancelIcon,
  Create as PencilIcon,
  Backspace as EraserIcon,
  TextFields as TextIcon,
  DoneAll,
} from '@material-ui/icons'

import './home.css'
import { backgrounds, imagesData } from "./meta.json"
import { ToolBarBtn } from "../UI/Toolbar"
import { APP_STATES, APP_TOOLS, ERASER_RADIUS, FONT_NAMES, PIXEL_RATIO_DOWNLAOD } from "./defaults"

import { initCanvas, board, shapes, transformer, addShape, mainLayer, updateShape } from "../canvas/manager"

let drawingTempData = []
export default function HomePage() {
  const
    // canvas related
    [color, setColor] = useState('#fff'),
    [selectedShapeInfo, setSelectedShapeInfo] = useState({ id: null, shapeAttrs: null }),
    // app functionality related
    [appState, setAppState] = React.useState(new Set()),
    [selectedTool, setSelectedTool] = React.useState(APP_TOOLS.NOTHING),
    [backgroundimage, setBackgroundimageDirect] = useState({ url: null, imageObj: null, }),
    [backgroundModalShow, setBackgroundModalShow] = useState(false),
    [imageModalShow, setImageModalShow] = useState(false)


  // functions -----------------------------------------
  const
    includeToAppStates = (val) =>
      setAppState(addToSet(appState, val))

    , excludeFromAppState = (val) =>
      setAppState(removeInSet(appState, val))

    , isInJamBoardMode = () =>
      appState.has(APP_STATES.DRAWING) &&
      (selectedTool === APP_TOOLS.PENCIL || selectedTool === APP_TOOLS.ERASER)

    , isColorPicking = () =>
      selectedTool === APP_TOOLS.FG_COLOR_PICKER || selectedTool === APP_TOOLS.STROKE_COLOR_PICKER

    , deleteShape = (shapeId) => {
      // let index = shapes.findIndex(it => it.id === shapeId)

      // if (index !== -1)
      //   setShapes(removeInArray(shapes, index))
    },
    addRectangle = (x, y) => {
      // addToShapes(true, newRectangle(x, y))
      addShape(newRectangle(x, y))
    },
    addCircle = (x, y) => {
      // addToShapes(true, newCircle(x, y))
    },
    drawArrow = () => {
      // addToShapes(true, newArrow())
    },
    ImageSetterHandler = (e) => {
      // addToShapes(true, newImage(e))
    },
    drawText = (t = 'تایپ کن') => {
      // addToShapes(true, newTextNode(t))
    },

    StartLineDrawingMode = () => {
      includeToAppStates(APP_STATES.DRAWING)
      setSelectedTool(APP_TOOLS.LINE)
    },
    startJamBoard = () => {
      includeToAppStates(APP_STATES.DRAWING)
      setSelectedTool(APP_TOOLS.PENCIL)
      setSelectedId(null)
    },
    saveAsImage = () => {
      let dataURL = board.toDataURL({ pixelRatio: PIXEL_RATIO_DOWNLAOD })
      downloadURI(dataURL, 'stage.png')
    },
    setBackgroundimage = (url) => {
      setBackgroundimageDirect({ url, imageObj: null })

      let imageObj = new Image()
      imageObj.src = url
      imageObj.onload = () =>
        setBackgroundimageDirect({ url, imageObj })
    },
    cancelOperation = () => {
      if (appState.has(APP_STATES.DRAWING)) {
        cleanArray(drawingTempData)
        // setTempShapes([])
      }

      setAppState(new Set())
      setSelectedTool(APP_TOOLS.NOTHING)
    },
    doneOperation = () => {
      if (appState.has(APP_STATES.DRAWING)) {

        // stick lines if they have Intersection, else create new line
        // if (isInJamBoardMode() && tempShapes.length !== 0) {
        //   let
        //     resultLines = [],
        //     tempPoints = []


        //   function stickToLast(...newPoints) {
        //     tempPoints.push(...newPoints)
        //   }
        //   function closeLastLine() {
        //     // resultLines.push(newCustomLine(tempPoints))
        //   }
        //   function addNewLine(...points) {
        //     tempPoints = points
        //   }

        //   tempPoints = tempShapes[0].points

        //   for (let i = 1; i < tempShapes.length - 1; i++) {
        //     let
        //       lcp = tempShapes[i].points, // current line points
        //       lnp = tempShapes[i + 1].points  // next line points

        //     // if end points of this line are equal to start points of next line
        //     if (arraysEqual(lcp.slice(2), lnp.slice(0, 2))) {
        //       stickToLast(...lnp.slice(2))
        //     }
        //     else {
        //       closeLastLine()
        //       addNewLine(...lnp)
        //     }
        //   }
        //   closeLastLine()

        //   addToShapes(false, ...resultLines)
        // }

      }
      cancelOperation()
    },

    // canvas events -------------------------

    setSelectedId = (shapeId) => {
      if (shapeId === null && selectedShapeInfo.id !== null) {
        transformer.nodes([])
        transformer.hide()
        updateShape(shapes[selectedShapeInfo.id], { draggable: false })
        
        setSelectedShapeInfo({
          id: null,
          shapeAttrs: null,
        })
      }
      else if (shapeId !== null) {
        let shape = shapes[shapeId]

        updateShape(shape, { draggable: true })
        transformer.show()
        transformer.nodes([shape])
        transformer.moveToTop()

        // TODO the next step is https://konvajs.org/docs/select_and_transform/Transform_Events.html

        setSelectedShapeInfo({
          id: shapeId,
          shapeAttrs: shape.attrs,
        })
      }
    },
    onShapeChanged = (changedAttrs) => {
      if (selectedShapeInfo.id !== null) {
        updateShape(shapes[selectedShapeInfo.id], changedAttrs)
        setSelectedShapeInfo({ ...selectedShapeInfo })
      }
    },
    onShapeSelected = (shapeId) => {
      setSelectedId(shapeId)
    },
    handleClick = (ev) => {
      if ('id' in ev.target.attrs) { // if a shape selected
        let id = ev.target.attrs.id
        onShapeSelected(id)
      }
      else { // FIXME it's not working for now - maybe i should set szie for layaer
        setSelectedId(null)
        cancelOperation()
      }
    },
    handleMouseDown = (e) => {
      if (!appState.has(APP_STATES.DRAGING))
        includeToAppStates(APP_STATES.DRAGING)

      if (appState.has(APP_STATES.DRAWING)) {
        const pos = e.target.getStage().getPointerPosition()
        drawingTempData = [pos.x, pos.y]
      }
    },
    handleMouseMove = (e) => {
      if (setHasParamsAnd(appState, APP_STATES.DRAWING, APP_STATES.DRAGING)) {
        var mp = board.getPointerPosition()
        mp = [mp.x, mp.y]


        if (selectedTool === APP_TOOLS.PENCIL) {
          // setTempShapes(
          //   addToArray(tempShapes,
          //     newSimpleLine(drawingTempData.concat(mp))))
          drawingTempData = mp
        }
        else if (selectedTool === APP_TOOLS.ERASER) {
          let acc = []
          // for (const l of tempShapes) {
          //   let
          //     sp = [l.points[0], l.points[1]],
          //     ep = [l.points[2], l.points[3]]

          //   if ([pointsDistance(sp, mp), pointsDistance(ep, mp)].every(v => v > ERASER_RADIUS)) {
          //     acc.push(l)
          //   }
          // }
          // setTempShapes(acc)
        }
      }
    },
    handleMouseUp = (e) => {
      if (selectedTool === APP_TOOLS.LINE) {
        let pos = e.target.getStage().getPointerPosition()
        // addToShapes(false, newStraghtLine(drawingTempData.concat([pos.x, pos.y])))
      }

      excludeFromAppState(appState, APP_STATES.DRAGING)
    }

  // register events -----
  useEffect(() => {
    const
      handleWindowKeyboard = (ev) => {
        if (ev.code === "Delete") {
          if (selectedShapeInfo.id) {
            deleteShape(selectedShapeInfo.id)
            setSelectedId(null)
          }
        }
        else if (ev.code === "Escape") {
          setSelectedId(null)
        }
      }

    window.addEventListener('keydown', handleWindowKeyboard)
    initCanvas({
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp
    })
  }, [])


  // config default states ------
  if (!backgroundimage.url) { // default state
    setBackgroundimage('/images/pexels-eberhard-grossgasteiger-1064162.jpg')
  }

  // render -------=
  return (
    <div id="home-page">

      {backgroundModalShow && <MyVerticallyCenteredModal
        title={"پس زمینه"}
        images={backgrounds}
        show={backgroundModalShow}
        setimage={setBackgroundimage}
        onHide={() => setBackgroundModalShow(false)}
      />
      }{imageModalShow && <MyVerticallyCenteredModal
        title={"تصویر"}
        images={imagesData}
        show={imageModalShow}
        setimage={(e) => ImageSetterHandler(e)}
        onHide={() => setImageModalShow(false)}
      />
      }

      <div id="tool-bar-wrapper"
      >
        <Paper
          id="tool-bar"
          elevation={3}>
          {/* Default State */
            !appState.has(APP_STATES.DRAWING) && <>
              <ToolBarBtn
                title="مستطیل"
                onClick={() => addRectangle(randInt(100), randInt(100))}
                iconEl={<RectangleIcon />}
              />
              <ToolBarBtn
                title="دایره"
                onClick={() => addCircle(randInt(100), randInt(100))}
                iconEl={<CircleIcon />}
              />
              <ToolBarBtn
                title="خط"
                onClick={StartLineDrawingMode}
                iconEl={<LineIcon />}
              />
              <ToolBarBtn
                title="متن"
                onClick={() => drawText()}
                iconEl={<TextIcon />}
              />
              <ToolBarBtn
                title="تصویر"
                iconEl={<ImageIcon />}
                onClick={() => setImageModalShow(true)}
              />
              <ToolBarBtn
                title="فلش"
                iconEl={<ArrowIcon />}
                onClick={drawArrow}
              />
              <ToolBarBtn
                title="تخته"
                iconEl={<JamBoardIcon />}
                onClick={startJamBoard}
              />
              <ToolBarBtn
                title="ذخیره"
                iconEl={<SaveIcon />}
                onClick={saveAsImage}
              />
              <ToolBarBtn
                title="پس زمینه"
                iconEl={<BackgroundIcon />}
                onClick={() => setBackgroundModalShow(true)}
              />
            </>
          }
          {/* JamBoard */
            isInJamBoardMode() && <>
              <ToolBarBtn
                title="مداد"
                iconEl={<PencilIcon />}
                onClick={() => setSelectedTool(APP_TOOLS.PENCIL)}
                disabled={selectedTool === APP_TOOLS.PENCIL}
              />
              <ToolBarBtn
                title="پاک کن"
                iconEl={<EraserIcon />}
                disabled={selectedTool === APP_TOOLS.ERASER}
                onClick={() => { setSelectedTool(APP_TOOLS.ERASER) }}
              />
            </>
          }
          {/* Drawing State */
            setHasParamsOr(appState, APP_STATES.DRAWING) && <>
              <ToolBarBtn
                title="ثبت عملیات"
                iconEl={<DoneAll />}
                onClick={doneOperation}
              />

              <ToolBarBtn
                title="لغو عملیات"
                iconEl={<CancelIcon />}
                onClick={cancelOperation}
              />
            </>
          }
        </Paper>
      </div>
      {// something selected 
        selectedShapeInfo.id !== null &&
        <Paper id="status-bar" className="p-3" square>
          <div className="mb-2">

            <span> نوع شکل: </span>
            <span>
              {
                Object.keys(shapeKinds)
                  .find(it => shapeKinds[it] === selectedShapeInfo.shapeAttrs.kind)
                  .toLowerCase()
              }
            </span>
          </div>

          {('x' in selectedShapeInfo.shapeAttrs) &&
            <TextField
              type="number"
              label="مختصات x"
              value={prettyFloatNumber(selectedShapeInfo.shapeAttrs.x)}
              onChange={e => {
                onShapeChanged({ x: parseInt(e.target.value) })
              }}
            />
          }
          {('y' in selectedShapeInfo.shapeAttrs) &&
            <TextField
              type="number"
              label="مختصات y"
              value={prettyFloatNumber(selectedShapeInfo.shapeAttrs.y)}
              onChange={e => {
                onShapeChanged({ y: parseInt(e.target.value) })
              }}
            />
          }
          {
            <TextField
              type="number"
              label="عرض"
              value={
                prettyFloatNumber
                  (selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine ?
                    selectedShapeInfo.shapeAttrs.points[2] :
                    selectedShapeInfo.shapeAttrs.width)
              }
              onChange={e => {
                // if (selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine)
                //   selectedShapeInfo.shapeAttrs.points = replaceInArray(selectedShapeInfo.shapeAttrs.points, 2, nv)

                // else
                //   selectedShapeInfo.shapeAttrs.width = nv

                onShapeChanged({ width: parseInt(e.target.value) })
              }}
            />
          }
          {selectedShapeInfo.shapeAttrs.kind !== shapeKinds.Text &&
            <TextField
              type="number"
              label="ارتفاع"
              value={
                prettyFloatNumber
                  (selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine ?
                    selectedShapeInfo.shapeAttrs.points[3] :
                    selectedShapeInfo.shapeAttrs.height)
              }
              onChange={e => {
                // let nv = parseInt(e.target.value)

                // if (selectedShapeInfo.shapeAttrs.kind === shapeKinds.StraghtLine)
                //   selectedShapeInfo.shapeAttrs.points = replaceInArray(selectedShapeInfo.shapeAttrs.points, 3, nv)

                // else
                //   selectedShapeInfo.shapeAttrs.height = nv

                onShapeChanged({ height: parseInt(e.target.value) })
              }}
            />
          }
          {('rotation' in selectedShapeInfo.shapeAttrs) && <>
            <Typography gutterBottom> چرخش </Typography>
            <Slider
              value={selectedShapeInfo.shapeAttrs.rotation}
              onChange={(e, nv) => onShapeChanged({ rotation: nv })}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              min={0}
              max={360}
              valueLabelDisplay="auto"
            />
          </>
          }
          {('text' in selectedShapeInfo.shapeAttrs) &&
            <TextField
              label="متن"
              rows={5}
              multiline
              value={selectedShapeInfo.shapeAttrs.text}
              onChange={e => onShapeChanged({ text: e.target.value })}
            />
          }
          {('fontSize' in selectedShapeInfo.shapeAttrs) && <>
            <Typography gutterBottom> اندازه فونت </Typography>
            <Slider
              value={selectedShapeInfo.shapeAttrs.fontSize}
              onChange={(e, nv) => onShapeChanged({ fontSize: nv })}
              aria-labelledby="discrete-slider-small-steps"
              step={0.5}
              min={1}
              max={150}
              valueLabelDisplay="auto"
            />
          </>
          }
          {(selectedShapeInfo.shapeAttrs.kind === shapeKinds.Text) && <>
            <Typography gutterBottom> نوع فونت </Typography>
            <Select
              value={selectedShapeInfo.shapeAttrs.fontFamily}
              onChange={e => onShapeChanged({ fontFamily: e.target.value })}
            >
              {FONT_NAMES.map(fname =>
                <MenuItem value={fname}>{fname} </MenuItem>)
              }
            </Select>

            <Typography gutterBottom> ارتفاع خط </Typography>
            <Slider
              value={selectedShapeInfo.shapeAttrs.lineHeight}
              onChange={(e, nv) => onShapeChanged({ lineHeight: nv })}
              aria-labelledby="discrete-slider-small-steps"
              step={0.1}
              min={0.1}
              max={8}
              valueLabelDisplay="auto"
            />

            <Typography gutterBottom> چینش </Typography>
            <Select
              value={selectedShapeInfo.shapeAttrs.align}
              onChange={e => onShapeChanged({ align: e.target.value })}
            >
              {['left', 'right', 'center'].map(v =>
                <MenuItem value={v}>{v} </MenuItem>)
              }
            </Select>
          </>
          }
          {('strokeWidth' in selectedShapeInfo.shapeAttrs) && <>
            <Typography gutterBottom> اندازه خط </Typography>
            <Slider
              value={selectedShapeInfo.shapeAttrs.strokeWidth}
              onChange={(e, nv) => onShapeChanged({ strokeWidth: nv })}
              aria-labelledby="discrete-slider-small-steps"
              step={selectedShapeInfo.shapeAttrs.kind === shapeKinds.Text ? 0.1 : 0.5}
              min={isKindOfLine(selectedShapeInfo.shapeAttrs.kind) ? 1 : 0}
              max={20}
              valueLabelDisplay="auto"
            />
          </>
          }
          {/* color picking */}
          {hasStroke(selectedShapeInfo.shapeAttrs.kind) &&
            <>
              {
                !isKindOfLine(selectedShapeInfo.shapeAttrs.kind) &&
                <div>
                  <span> رنگ داخل: </span>
                  <ColorPreview
                    onClick={() => {
                      if (selectedTool === APP_TOOLS.FG_COLOR_PICKER)
                        setSelectedTool(APP_TOOLS.NOTHING)
                      else {
                        setSelectedTool(APP_TOOLS.FG_COLOR_PICKER)
                        setColor(selectedShapeInfo.shapeAttrs.fill)
                      }
                    }}
                    hexColor={selectedShapeInfo.shapeAttrs.fill} />
                </div>
              }
              <div>
                <span> رنگ خط: </span>
                <ColorPreview
                  onClick={() => {
                    if (selectedTool === APP_TOOLS.STROKE_COLOR_PICKER)
                      setSelectedTool(APP_TOOLS.NOTHING)
                    else {
                      setSelectedTool(APP_TOOLS.STROKE_COLOR_PICKER)
                      setColor(selectedShapeInfo.shapeAttrs.stroke)
                    }
                  }}
                  hexColor={selectedShapeInfo.shapeAttrs.stroke} />
              </div>
              {
                isColorPicking() &&
                <div id="color-picker-wrapper">
                  <SketchPicker
                    disableAlpha
                    color={color}
                    onChange={(color) => setColor(color['hex'])}
                    onChangeComplete={(color) => {
                      let key = selectedTool === APP_TOOLS.STROKE_COLOR_PICKER ? 'stroke' : 'fill'
                      onShapeChanged({ [key]: color['hex'] })
                    }}
                  />
                </div>
              }
            </>
          }
          {('opacity' in selectedShapeInfo.shapeAttrs) && <>
            <Typography gutterBottom> شفافیت </Typography>
            <Slider
              value={selectedShapeInfo.shapeAttrs.opacity}
              onChange={(e, nv) => { onShapeChanged({ opacity: nv }) }}
              aria-labelledby="discrete-slider-small-steps"
              step={0.01}
              min={0.05}
              max={1}
              valueLabelDisplay="auto"
            />
          </>
          }
          <button className="btn btn-danger mt-3" onClick={() => setSelectedId(null)}>
            خروج
          </button>
        </Paper>
      }
      {
        selectedShapeInfo.id === null && <CustomSearchbar
          onAyaSelect={t => drawText(t)} />
      }
      <div id="container" className="w-100 h-100"></div>
    </div>
  )
}