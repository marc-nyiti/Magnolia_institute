import React, { Component } from 'react';
import Identicon from 'identicon.js';
import DataViz from '../dataviz.gif'
import TopBanner from '../topBanner.png'

class Main extends Component {

  render() {

   return (



     <div className="container-fluid mt-5">


       <div className="row">
         <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '800px' }}>
           <div className="content mr-auto ml-auto">

           {/* TopBanner*/}
           <div>
             <img src={TopBanner} alt="this is TopBanner" className='center' />
          </div>

           {/*DataViz*/}
               <div>
                 <img src={DataViz} alt="this is DataViz" className='center' />
              </div>

          {/*text*/}
              <p>&nbsp;</p>
              <h4>The Magnolia Institute is a decentralized platform that utilizes blockchain technology for real-time disease tracking. </h4>

          {/*Uploader*/}
             <p>&nbsp;</p>
             <h2>Share Medical Image</h2>
             <form onSubmit={(event) => {
               event.preventDefault()
               const description = this.imageDescription.value
               const gpsCoordinates = this.gpsCoordinates.value
               const medicalLicense = this.medicalLicense.value
               this.props.uploadImage(description)
             }} >
               <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                 <div className="form-group mr-sm-2">
                   <br></br>
                   <input
                     id="medicalLicense"
                     type="text"
                     ref={(input) => { this.medicalLicense = input }}
                     className="form-control"
                     placeholder="Enter valid medical license#"
                     required />
                     <br></br>
                     <input
                       id="gpsCoordinates"
                       type="text"
                       ref={(input) => { this.gpsCoordinates = input }}
                       className="form-control"
                       placeholder="Enter GPS coordinates"
                       required />
                       <br></br>
                         <input
                           id="imageDescription"
                           type="text"
                           ref={(input) => { this.imageDescription = input }}
                           className="form-control"
                           placeholder="Image description..."
                           required />
                 </div>


               <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
             </form>

             <p>&nbsp;</p>

             {/*Return the IPFS data*/}
             { this.props.images.map((image, key) => {
               return(
                 <div className="card mb-4" key={key} >
                   <div className="card-header">
                     <img
                       className='mr-2'
                       width='30'
                       height='30'
                       src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                     />
                     <small className="text-muted">{image.author}</small>
                   </div>
                   <ul id="imageList" className="list-group list-group-flush">
                     <li className="list-group-item">
                       <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth:'100%'}}/></p>
                       <p>{image.description}</p>
                     </li>
                     <li key={key} className="list-group-item py-2">
                       <small className="float-left mt-1 text-muted">
                         DONATIONS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                       </small>

                       {/*DONATE*/}
                       <button
                         className="btn btn-link btn-sm float-right pt-0"
                         name={image.id}
                         onClick={(event) => {
                           let tipAmount = window.web3.utils.toWei('0.01', 'Ether')
                           console.log(event.target.name, tipAmount)
                           this.props.tipImageOwner(event.target.name, tipAmount)
                         }}
                       >
                         DONATE 0.1 ETH to the researcher
                       </button>

                     </li>
                   </ul>
                 </div>
               )
             })}
           </div>
         </main>
       </div>
     </div>
   );
 }
}

export default Main;
