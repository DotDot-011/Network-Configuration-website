import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

interface props {
    Repositories: Array<string>;
}

function RepoList(props : props) {

    const [Repositories, setRepositories] = useState<Array<string>>([]);

    useEffect(() => {
        setRepositories(props.Repositories);
    }, [props])

    function onClickHadler(e : Event){

    }

    return (
        <ListGroup>
            {Repositories.map((Repository) => {
                return (<ListGroup.Item >{Repository}</ListGroup.Item>)
            })}
        </ListGroup>
    );
}

export default RepoList;
