import React from 'react'
import { Image } from 'semantic-ui-react'


class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fileData: '',
                imagePreviewUrl: '',
                fileReader: null};
  }


  setImage() {

   let myHeaders = new Headers()
   myHeaders.append('Content-Type', 'application/json')
   myHeaders.append('Accept', 'application/json')


   let myBody =
   {"image": {
                 "image_file_name": this.state.fileData.name,
                 "image_content_type": this.state.fileData.type,
                 "image_file_size": this.state.fileData.size
               },
    "file_data": this.state.fileReader.result
   }

   this.props.setImageToUpload(myHeaders, myBody)



 }

  _handleImageChange(e) {
   e.preventDefault();
   let reader = new FileReader();
   let file = e.target.files[0];

   reader.onloadend = () => {
     this.setState({
       fileData: file,
       imagePreviewUrl: reader.result,
       fileReader: reader
     }, this.setImage);
   }

   reader.readAsDataURL(file)
 }


 render() {
   let {imagePreviewUrl} = this.state;
   let $imagePreview = null;
   if (imagePreviewUrl) {
     $imagePreview = (<Image src={imagePreviewUrl} size='medium' alt='uploaded preview' />);
   } else {
     $imagePreview = (<div className="previewText"></div>);
   }

   return (
     <div className="previewComponent">

         <input className="fileInput"
           type="file"
           onChange={(e)=>this._handleImageChange(e)} />


       <div className="imgPreview">
         {$imagePreview}
       </div>


     </div>

   )


 }
}

export default ImageUploader








// <div className="previewComponent">
//   <form action={`${OUR_API_URL}/testimageupload`} method='POST'>
//     <input className="fileInput"
//       type="file"
//       value='iimage'
//       name='iiimage'
//       />
//     <button className="submitButton"
//       type="submit"
//       >Upload Image</button>
//   </form>
//   <div className="imgPreview">
//     {$imagePreview}
//   </div>
// </div>
