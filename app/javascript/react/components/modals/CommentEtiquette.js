import React from 'react';
import BasicModal from './BasicModal';

export const CommentEtiquette = props => {
  var etiquette;

  if (props.galleryCommentEtiquette) {
    etiquette =
    <ul>
      <li>{props.galleryCommentEtiquette}</li>
    </ul>
  } else {
    etiquette =
    <ul>
      <li>Please be respectful of others when commenting, including refraining from threatening, bullying or harassing as well as commenting for the sake of trolling.</li>
      <li>Spamming is frowned upon and could result in a ban as well as deletion of all comments.</li>
      <li>Impersonating other individuals is not allowed, nor is publishing personal contact information.</li>
      <li>Illegal or sexually suggestive material, including pornography, is not allowed and could result in being banned.</li>
      <li>Inciting violence is also prohibited and is strictly enforced. Please use this platform to have productive discussions and enjoy yourself and please be mindful of the rights of others as well.</li>
    </ul>
  }

  return (
    <BasicModal
      modalButtonText="Commenting Etiquette"
      modalTitle="Commenting Etiquette"
      modalButtonClass="cf-fade-button"
    >
      {etiquette}
    </BasicModal>
  )
}

export default CommentEtiquette
