import React from 'react';
import {Modal} from "react-bootstrap";
import MyButton from "../../UI/MyButton/MyButton";


const FullImgModal = ({img, onHide, show, path}) => {


    return (
        <Modal
            className='modal full-img-modal'
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">


                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex justify-content-center'>
                    {img &&
                        <img alt='' className='full-img' src={process.env.REACT_APP_API_URL+`${path}${img}`}/>
                    }
                </div>

            </Modal.Body>
            <Modal.Footer>
                <MyButton onClick={onHide}>Закрыть</MyButton>
            </Modal.Footer>
        </Modal>
    );
};

export default FullImgModal;