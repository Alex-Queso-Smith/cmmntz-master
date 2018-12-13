import React from 'react';
import BasicModal from './BasicModal';

export const CommentEtiquette = props => {
  var etiquette;

  if (props.galleryCommentEtiquette) {
    etiquette =
    <p>{props.galleryCommentEtiquette}</p>
  } else {
    etiquette =
    <div className="cf-commenting-etiquette-body">
      <p>This is the default Etiquette</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus odio nec magna consequat, et cursus turpis placerat. Sed at tristique nisl, in pharetra urna. Vestibulum nec tortor eget velit eleifend ullamcorper eget at purus. Fusce consequat magna tellus, vitae laoreet tortor aliquam quis. Pellentesque finibus diam lacinia, euismod libero vitae, faucibus risus. Etiam a nunc sed quam semper eleifend vitae et ex. Cras volutpat, lectus et porta elementum, nibh nisl condimentum augue, nec tempus lectus lectus nec ligula. Pellentesque sed commodo eros, vel feugiat magna. Nam eleifend pellentesque pretium. Nam lacus sapien, bibendum sit amet diam volutpat, ornare feugiat arcu. Proin tempus aliquet enim, quis pellentesque tortor hendrerit a. Nunc vel metus pulvinar, ultrices sapien ut, sagittis sem. Pellentesque luctus consectetur suscipit. Curabitur luctus condimentum scelerisque. Integer vitae imperdiet nulla, sed placerat tellus.</p>

      <p>Fusce non ante nec mi sagittis pellentesque. Quisque nulla elit, auctor quis augue sed, porttitor scelerisque nulla. Nullam sit amet placerat lacus. Donec massa lacus, maximus ut pretium cursus, efficitur in eros. Aenean urna ex, ornare sit amet quam quis, efficitur congue risus. Nunc faucibus eget nibh nec scelerisque. Phasellus commodo congue augue, eget ultricies enim. Suspendisse vehicula nunc consequat risus tempus, nec consequat nulla interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent mattis ante finibus, cursus leo tempor, maximus turpis. Phasellus lectus leo, auctor quis mauris a, rutrum dictum urna. Vestibulum eu molestie elit. Phasellus convallis porta diam, in fermentum orci. Ut quis eleifend nulla, eu lacinia ex. Quisque tempus tellus vel ipsum feugiat, ut euismod nunc consectetur. Fusce dictum dignissim ultrices.</p>

      <p>Donec consectetur, nisi eu placerat vestibulum, nunc nulla vestibulum neque, eget rutrum velit eros blandit eros. Duis aliquet massa et maximus rhoncus. Nunc in justo ligula. Fusce sed arcu blandit, consequat tellus vel, aliquet ex. Fusce ac varius libero. In ac scelerisque odio, nec euismod tellus. Maecenas laoreet odio lectus, ut tempor nulla tristique non. Sed commodo, odio at congue tempus, sem nulla volutpat nibh, a fringilla dolor arcu ac turpis. Nam egestas egestas metus dapibus fermentum. Aenean vestibulum lacus eu faucibus eleifend. Nunc eu arcu auctor, luctus lacus a, lobortis erat. Morbi vel venenatis leo. Suspendisse fermentum condimentum dolor in accumsan. Praesent tincidunt varius lacinia. Vivamus egestas tellus et eleifend viverra.</p>

      <p>Cras hendrerit elementum ipsum in faucibus. Cras porta pharetra urna sit amet pretium. Etiam convallis suscipit velit nec mattis. Donec commodo placerat libero, eu vulputate nibh semper vel. Etiam porta, nunc cursus tempor interdum, sapien magna dapibus augue, sed ultrices magna enim quis libero. Donec et egestas magna. In semper sem est, id congue enim lacinia at. Nullam posuere est sed accumsan viverra. Donec in elit sed mi vestibulum vulputate. In at libero sed elit finibus ultrices ut nec leo. In vestibulum hendrerit lectus, ac vestibulum nisl posuere non. Proin quis ligula dui.</p>

      <p>Pellentesque lacinia neque ut tincidunt scelerisque. Praesent commodo lectus risus, sed blandit nibh lacinia ut. In fermentum hendrerit velit quis condimentum. Sed rutrum volutpat urna, vel ornare elit finibus nec. Nam mattis imperdiet velit, et pulvinar ante convallis ut. Sed at dolor pulvinar lorem ullamcorper venenatis. Donec maximus auctor nulla et blandit. Etiam tincidunt lacus eget porta interdum. Curabitur ut rhoncus magna. Vivamus placerat ornare lacinia. Nulla viverra mauris vel nisl molestie faucibus. Quisque imperdiet ipsum in neque aliquet faucibus fermentum in enim.</p>
    </div>
  }

  return (
    <BasicModal
      modalButtonText="Commenting Etiquette"
      modalTitle="Commenting Etiquette"
      modalButtonClass="btn-dark"
    >
    {etiquette}
    </BasicModal>
  )
}

export default CommentEtiquette
