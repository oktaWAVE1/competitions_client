import React from 'react';
import {Form} from "react-bootstrap";

const AddImgModule = ({setFile, multiple, header}) => {
    const selectFile = e => {

        setFile(e.target.files)
    }
    return (
        <Form>
            <h5 className="mt-3">{header ? header : 'Добавить изображение:'}</h5>
            <Form.Control onChange={selectFile} multiple={multiple} placeholder="Выберите изображение" type="file" />
        </Form>
    );
};

export default AddImgModule;