import React,{useState} from 'react';
import Card from '../../shared/components/UIElements/Card';
import './PlaceItem.css';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';

const PlaceItem = props =>{

  const [showMap,setShowMap] =useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHander = () => setShowMap(false);

  const [showConfirmModal,setShowConfirmModal]=useState(false);

  const showDeleteWarningHandler = () =>{
    setShowConfirmModal(true);
  }

  const cancelDeleteHandler = () =>{
    setShowConfirmModal(false);
  }

  const confirmDeleteHandler = () =>{
    setShowConfirmModal(false);
    console.log("Delete");
  }

  return (
     <React.Fragment>
       <Modal show={showMap} onCancel={closeMapHander} header={props.address} contentClass="place-item__modal-content" footerClass="place-item__modal-actions" footer={<Button onClick={closeMapHander}>Close</Button>}>
         <div className="map-container">
           <Map center={props.coordinates} zoom={16}/>
         </div>
       </Modal>

       <Modal show={showConfirmModal} onCancel={cancelDeleteHandler} header="Are You Sure?" footerClass="place-item__modal-actions" footer={
         <React.Fragment>
           <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
           <Button danger onClick={confirmDeleteHandler}>Delete</Button>
          </React.Fragment>
       }>
         <p>The Delete click will result in deletion of the place which can't be undone!!!!!!</p>
       </Modal>
    <li className="place-item">
      <Card className="place-item__content">
        <div className="place-item__image">
            <img src={props.image} alt={props.title}/>
        </div>

        <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
        </div>

        <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>View on Map</Button>
            <Button to={`/places/${props.id}`}>Edit</Button>
            <Button danger onClick={showDeleteWarningHandler}>Delete</Button>
        </div>
      </Card>
  </li>
  </React.Fragment>)
}

export default PlaceItem;