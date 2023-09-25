import React, {useState} from 'react';
import {Dropdown} from "react-bootstrap";
import {addCompetitionNextRoundHeat} from "../http/heatAPI";
import MyButton from "../UI/MyButton/MyButton";
import {observer} from "mobx-react-lite";

const NextRoundBlock = ({contestantsNumber, groups, groupId, round, setSearchParams, setNextRound, modifyGroup, currentGroup, teamType}) => {
    const [contestants, setContestants] = useState({nextRoundNum: 1, nextGroupId: null, nextGroupDescription: '', nextGroupNum: 1});
    const createNextRound = async () => {
        modifyGroup(currentGroup.id, currentGroup.description, Number(currentGroup.round)+1, currentGroup.status)
        setNextRound(false)
        await addCompetitionNextRoundHeat({
            groupId: groupId,
            round: round,
            nextRoundNum: contestants. nextRoundNum,
            nextGroupNum: contestants.nextGroupNum,
            nextGroupId: contestants.nextGroupId,
            totalNum: contestantsNumber
        })
    }
    return (
        <div className='w-100 next-round-block'>
            <h3>Следующий раунд</h3>
            <div className='d-flex flex-row align-items-center'>


                <div className='d-flex flex-column align-items-center col'>
                    <span>{contestants.nextRoundNum}</span>
                    <input
                        type='range'
                        min={0}
                        max={contestantsNumber || 1}
                        step={1}
                        value={contestants.nextRoundNum}
                        onChange={e => setContestants({...contestants, nextRoundNum: e.target.value, nextGroupNum: (contestantsNumber-e.target.value)})}/>
                    <span># участников в следующий этап</span>
                </div>

                <div className='d-flex flex-column align-items-center col'>
                    <span>{contestants.nextGroupNum}</span>
                    <input
                        type='range'
                        min={0}
                        max={contestantsNumber || 1}
                        step={1}
                        value={contestants.nextGroupNum}
                        onChange={e => setContestants({...contestants, nextGroupNum: e.target.value})}/>
                    <span># участников в группу</span>
                </div>
                <Dropdown className="col d-flex justify-content-center">
                    <Dropdown.Toggle title={'Перемещение в группу'} className='round'>{contestants.nextGroupDescription ? contestants.nextGroupDescription : 'Выберите группу'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {groups?.length >= 1 && groups.map(g =>
                            <Dropdown.Item onClick={() => setContestants({...contestants, nextGroupId: g.id, nextGroupDescription: g.description})}
                                           title={g.description}
                                           key={g.id}>{g.description}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>

            </div>
            <MyButton classes='w-100 mt-3' onClick={() => createNextRound()}>Создать раунд</MyButton>


        </div>
    );
};

export default NextRoundBlock;