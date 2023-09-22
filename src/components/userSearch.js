import React, {useState} from 'react';
import {Dropdown, Form} from "react-bootstrap";
import {useUserSearch} from "../hooks/useUserSearch";
import MyButton from "../UI/MyButton/MyButton";

const UserSearch = ({label, placeholder, users, anyrole, roles, user, setUser, name, id, dropdownLabel, button, buttonLabel, callback, alwaysOn}) => {
    const [checked, setChecked] = useState(false);
    const [query, setQuery] = useState('');
    const searchedUsers = useUserSearch(users, query)
    return (
        <Form>
            {!alwaysOn &&
        <Form.Switch label={label} checked={checked} onChange={() => setChecked(prev => !prev)} />
            }
    {(checked || alwaysOn) &&
    <div>
        <Form.Control placeholder={placeholder} type="input" value={query} onChange={e => setQuery(e.target.value)} />
        <Dropdown className="d-flex w-auto p-0 mt-3 justify-content-center user-selector" >
            <Dropdown.Toggle>{user[name] ? user[name] : dropdownLabel}</Dropdown.Toggle>
            <Dropdown.Menu >
                {searchedUsers.length>=1 && searchedUsers.filter(u => anyrole || roles.includes(u.role)).map(u =>
                    <Dropdown.Item onClick={(e) => setUser({...user, [id]: u.id, [name]: u.name})} title={u.name+" "+u.telephone+" " + u.email} key={u.id}>{u.name+" "+u.telephone+" " + u.email} </Dropdown.Item>
                )}
            </Dropdown.Menu>

        </Dropdown>
        {button &&
            <MyButton disabled={!user[id]} onClick={(e) => callback(e)} classes='mt-3 w-100'>{buttonLabel}</MyButton>
        }
    </div>
    }
        </Form>
    );
};

export default UserSearch;