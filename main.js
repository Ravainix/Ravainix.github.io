const input = document.querySelector('input')
const download = document.querySelector('#download')
let state = {};

const stage = new Konva.Stage({
  container: 'editr-container',   // id of container <div>
  width: 600,
  height: 600
});

const layer = new Konva.Layer();
stage.add(layer)

const aaa = () => {
  Konva.Image.fromURL('./assets/hats/13.png', (node) => {
    node.setAttrs({
      x: (stage.width() - (node.width() * .5)) / 2,
      y: (stage.height() - (node.height() * .5)) / 2,
      scaleX: 0.5,
      scaleY: 0.5,
      draggable: true,
      name: 'hat'
    })
    layer.add(node)
    layer.batchDraw()
  })
}

//TRANSFORM HAT

stage.on('click tap', function (e) {
  // if (e.target === stage) {
  //   stage.find('Transformer').destroy();
  //   layer.draw();
  //   return;
  // }
  if (!e.target.hasName('hat')) {
    stage.find('Transformer').destroy();
    layer.draw();
    return;
  }
  stage.find('Transformer').destroy();

  var tr = new Konva.Transformer();
  layer.add(tr);
  tr.attachTo(e.target);
  layer.draw();
});

layer.draw()

// HANDLE INPUT 

const handleAvatarInput = (e) => {
  const file = e.target.files[0]

  if (file.type.match('image.*')) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = addImageToLayer
    input.style.display = 'none'
  }
}

const addImageToLayer = (event) => {
  if (event.target.readyState == FileReader.DONE) {
    const imageObj = new Image();
    
    imageObj.onload = () => {
      // resizeCanvas(imageObj)
      const ratio = calculateResizeRatio(imageObj);

      const avatar = new Konva.Image({
        x: (stage.width() - (imageObj.width * ratio)) / 2,
        y: (stage.height() - (imageObj.height * ratio)) / 2,
        image: imageObj,
        width: (imageObj.width * ratio),
        height: (imageObj.height * ratio)
      });
      
      state = {width: imageObj.width, height: imageObj.height};
      layer.add(avatar);
      layer.batchDraw();
      aaa()
    }
    imageObj.src = event.target.result;
  }
}    

const calculateResizeRatio = (image) => {
  const hRatio = stage.width() / image.width;
  const vRatio = stage.height() / image.height;
  const ratio = Math.min(hRatio, vRatio);
  
  if(image.width > 600 || image.height > 600){
    return ratio
  } else {
    return 1
  }
}

const resizeCanvas = (image) => {
  const newWidth = image.width > 600 ? 600 : image.width;
  const newHeight = image.height > 600 ? 600 : image.height;
  stage.width(newWidth) 
  stage.height(newHeight)
}

input.addEventListener('change', handleAvatarInput);

//HANDLE DOWNLOAD BUTTON
function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

download.addEventListener('click', () => {
  
  downloadURI(makeCanvasCopy().toDataURL({ pixelRatio: 1 }), 'avatar.png');
  },
  false
);

const makeCanvasCopy = () => {
  const canvasCopy = stage.clone()
  const avatarWidth = canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[0].width()
  const avatarHeight = canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[0].height()
  const avatarY = canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[0].y()
  const avatarX = canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[0].x()
  const hatY = canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[1].y()
  const hatX = canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[1].x()

  canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[1].y(hatY - avatarY)
  canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[0].y(0)

  canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[1].x(hatX - avatarX)
  canvasCopy.getStage().getLayers().getChildren()[0].getChildren()[0].x(0)
  canvasCopy.draw()

  canvasCopy.size({ width: avatarWidth, height: avatarHeight})

  return canvasCopy
} 