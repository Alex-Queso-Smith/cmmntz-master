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
      <p>Please be respectful of others when commenting, including refraining from threatening, bullying or harassing as well as commenting for the sake of trolling.</p>
      <p>Spamming is frowned upon and could result in a ban as well as deletion of all comments.</p>
      <p>Impersonating other individual is not allowed, nor is publishing personal contact information.</p>
      <p>Illegal or sexually suggestive material, including pornography, is not allowed and could result in being banned.</p>
      <p>Inciting violence is also prohibited and is strictly enforced.Please use this platform to have productive discussions and enjoy yourself and please be mindful of the rights of others as well.</p>
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
