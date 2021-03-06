import Konva from "konva"

import { DEFAULT_STROKE_WIDTH, shapeKinds } from './'
import {
  addCommonEvents, applyPropsToShape,
  everyShapeProps, everyShapeAttrs, applyDefaultSetters
} from "./abstract"

import { newRectangle } from "./shapes"

// the main node is node[0], you can set it to undefined if you dont want
export function newStage(options = {}, nodes = [], events = []) {
  let group = new Konva.Group({ ...everyShapeAttrs() })
  group.props = {
    ...everyShapeProps(),
    kind: shapeKinds.Stage,

    x: 0,
    y: 0,
    width: 100,
    height: 100,

    rotation: 0,
    borderSize: nodes.length ? 0 : DEFAULT_STROKE_WIDTH,
    borderColor: "#21C0AD",

    ...options,
  }

  let overly = newRectangle({
    fill: 'transparent',
    dash: [20, 20],
  }, false)
  group.parts = { overly }

  group.nodes = nodes
  group.mainNode = nodes[0]

  group.setters = {
    width: w => {
      overly.setters.width(w)
      for (let n of nodes) {
        n.setters.width(w)
        n.props.width = w
      }
    },
    height: h => {
      overly.setters.height(h)
      for (let n of nodes) {
        n.setters.height(h)
        n.props.height = h
      }
    },
  }
  applyDefaultSetters(overly, group.setters, [
    ["borderColor", "stroke"],
    ["borderSize", "strokeWidth"],
  ])
  applyDefaultSetters(group, group.setters, [
    'x', 'y',
    'draggable',
    'rotation',
    "scaleX",
    "scaleY",
    "dragBoundFunc",
    "position"
  ])
  addCommonEvents(group)
  applyPropsToShape(group.props, group.setters)

  for (const ev in events)
    group.on(ev, events[ev])

  group.add(...nodes, overly)
  return group
}