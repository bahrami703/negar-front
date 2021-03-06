export const
  APP_STATES = {
    DRAGING: 0,
    DRAWING: 1,
  },

  APP_TOOLS = {
    NOTHING: 0,
    LINE: 1,
    PENCIL: 2,
    ERASER: 3,
    FG_COLOR_PICKER: 4,
    STROKE_COLOR_PICKER: 5,
    SHAPE_DRAWING: 6,
    HAND: 7,
  },

  TABS = {
    VISUAL: 0,
    INFO: 1,
    META: 2,
    // -------------
    STAGE_TREE_VIEW: 3,
  },

  ERASER_RADIUS = 10,
  PIXEL_RATIO_DOWNLAOD = 1,
  ZOOM_ON_SHAPE_RATIO = 0.8,
  ZOOM_ON_SHAPE_MARGIN = 0.1,
  FONT_NAMES = [
    'Neirizi', 'Al Qalam New', 'QuranTaha', 'Shabnam',
  ]

export function isShapeRelatedTab(tnumber) {
  return tnumber <= TABS.META
}