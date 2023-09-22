import {Card, Dropdown, Form, Modal, Row} from "react-bootstrap";
import MyButton from "../../UI/MyButton/MyButton";
import {Link} from "react-router-dom";


const CompetitionsListModal = ({onHide, show, competitions} ) => {

    return (
        <Modal
            className='modal'
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Список соревнований: </h1>

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {competitions?.length>0 &&
                <div>
                    {competitions.map(comp =>
                        <Card key={comp.id}>
                            <Link title='Редактировать' to={`/edit_competition/${comp.id}`}>
                                <h4>{comp.name}</h4>
                            </Link>
                            <div className="p-2">{comp.description}</div>
                        </Card>
                    )}
                </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <MyButton onClick={onHide}>Закрыть</MyButton>
            </Modal.Footer>
        </Modal>
    );
};

export default CompetitionsListModal;