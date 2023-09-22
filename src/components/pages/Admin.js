import React, {useContext, useEffect, useState} from 'react';
import MyButton from "../../UI/MyButton/MyButton";
import {Card, Container, Row} from "react-bootstrap";
import CompetitionModal from "../modals/CompetitionModal";
import CompetitionsListModal from "../modals/CompetitionsListModal";
import {Context} from "../../index";
import {fetchAllCompetitions} from "../../http/competitionAPI";
import {observer} from "mobx-react-lite";
import {fetchAllSports} from "../../http/sportAPI";
import SportsCategoriesModal from "../modals/SportsCategoriesModal";
import useDebounce from "../../hooks/useDebounce";
import UserRolesModal from "../modals/UserRolesModal";
import {fetchUsers} from "../../http/userAPI";

const Admin = observer(() => {
    const [modals, setModals] = useState({competitions: false, competitionsList: false, users: false, sports: false, categories: false, tricks: false})
    const {competition, sport, loading} = useContext(Context)
    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState(1);

    useEffect( () => {
        fetchAllCompetitions().then(data => competition.setCompetition(data.sort((a, b) => b.id - a.id)))
        fetchAllSports().then(data => sport.setSport(data.sort((a, b) => a.name - b.name)))
        fetchUsers().then(data => setUsers(data.sort((a, b) => a.name - b.name)))
    }, []);

    useDebounce(async () => {
        await fetchAllCompetitions().then(data => competition.setCompetition(data.sort((a, b) => b.id - a.id)))
        await fetchAllSports().then(data => sport.setSport(data.sort((a, b) => a.name - b.name)))
        await fetchUsers().then(data => setUsers(data.sort((a, b) => a.name - b.name)))
    }, 1000, [loading.refresh, refresh])

    return (
        <Container className="w-100">
            <h1>Админочка</h1>

                <Row>
                    <Card className='d-flex gap-1 border-0'>
                        <MyButton onClick={() => setModals({...modals, competitionsList: true})}>Список соревнований</MyButton>
                        <MyButton onClick={() => setModals({...modals, competitions: true})}>Новое соревнование</MyButton>
                        <MyButton onClick={() => setModals({...modals, sports: true})}>Спорт и категории трюков</MyButton>
                        <MyButton onClick={() => setModals({...modals, users: true})}>Роли пользователей</MyButton>

                    </Card>

                </Row>
            <UserRolesModal setRefresh={setRefresh} onHide={() => setModals({...modals, users: false})} show={modals.users} users={users} />
            <SportsCategoriesModal setRefresh={setRefresh} sports={sport.sport} onHide={() => setModals({...modals, sports: false})} show={modals.sports} />
            <CompetitionModal users={users} setRefresh={setRefresh} competitions={competition.competition} sports={sport.sport} onHide={() => setModals({...modals, competitions: false})} show={modals.competitions} />
            <CompetitionsListModal competitions={competition.competition} sports={sport.sport} onHide={() => setModals({...modals, competitionsList: false})} show={modals.competitionsList} />
        </Container>
    );
});

export default Admin;