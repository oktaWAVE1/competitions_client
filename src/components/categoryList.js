import React from 'react';
import {Form} from "react-bootstrap";

const CategoryList = ({categories, checked, switchCategory, header}) => {
    return (
        <Form>
            <Form.Group>
                <h5>{header}</h5>

                {categories?.length>0 && categories.map(cat =>
                    <div key={cat.id}>
                        <div className='d-flex align-items-center'>
                            <Form.Check
                                className='d-flex gap-2 align-items-center'
                                type='radio'
                                value={cat.id}
                                label={cat.name}
                                onChange={e => switchCategory(e)}
                                checked={cat.id.toString() === checked}
                            />
                        </div>

                        {cat?.children?.length>0 &&
                            <ul className='mb-0'>
                                {cat.children.map(subCat =>
                                    <div key={cat.id+subCat.id} className='d-flex align-items-center'>
                                        <Form.Check
                                            className='d-flex gap-2 align-items-center'
                                            type='radio'
                                            value={subCat.id}
                                            label={subCat.name}
                                            onChange={e => switchCategory(e)}
                                            checked={subCat.id.toString() === checked}
                                        />
                                    </div>
                                )}
                            </ul>
                        }
                    </div>
                )}
            </Form.Group>
        </Form>
    );
};

export default CategoryList;