var controls = []

module.exports.setControls = function(res,fn){
  controls = [{
    id: 1,
    iconPath: '/images/location.png',
    position: {
      left: 20,
      top: res.windowHeight / 2 + 95,
      width: 50,
      height: 50
    },
    clickable: true
  },
  {
    id: 3,
    iconPath: '/images/customerService.jpg',
    position: {
      left: res.windowWidth - 70,
      top: res.windowHeight - 80,
      width: 50,
      height: 50
    },
    clickable: true
  },
  {
    id: 4,
    iconPath: '/images/marker.png',
    position: {
      left: res.windowWidth / 2 - 11,
      top: res.windowHeight / 2 - 45,
      width: 22,
      height: 45
    },
    clickable: true
  },
  {
    id: 6,
    iconPath: '/images/plus.png',
    position: {
      left: res.windowWidth - 50,
      top: res.windowHeight - 180,
      width: 40,
      height: 40
    },
    clickable: true
  },
  {
    id: 7,
    iconPath: '/images/minus.jpg',
    position: {
      left: res.windowWidth - 50,
      top: res.windowHeight - 130,
      width: 40,
      height: 40
    },
    clickable: true
  },
  ]
  console.log(controls)
  fn(controls)

}
module.exports.controls = controls

