import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

interface props {
    Repositories: Array<RepoTag>;
}

interface RepoTag {
    repositoryName: string,
    repositoryId: number
}

function RepoList(props : props) {

    const [Repositories, setRepositories] = useState<Array<RepoTag>>([]);

    useEffect(() => {
        setRepositories(props.Repositories);
    })

    return (
        <ListGroup>
            {Repositories.map((Repository) => {
                return (<ListGroup.Item action key={Repository.repositoryId} href={"/config/" + Repository.repositoryId}>{Repository.repositoryName}</ListGroup.Item>)
            })}
        </ListGroup>
    );
}

export default RepoList;
