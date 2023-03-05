import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import "./Repolist.css"

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
        <>
            <div id="sidebar-wrapper">
            <nav id="spy">
                <ul className="sidebar-nav nav">
                    <li className="sidebar-brand">
                        <a href="#home"><span className="fa fa-home solo">Repository List</span></a>
                    </li>
                    {Repositories.map((Repository) => {
                    return (<li><a href={"/config/" + Repository.repositoryId}>{Repository.repositoryName}</a></li>)
                    })}
                    
                </ul>
            </nav>
        </div>
        {/*// <ListGroup>
                {Repositories.map((Repository) => {
                    return (<ListGroup.Item action key={Repository.repositoryId} href={"/config/" + Repository.repositoryId}>{Repository.repositoryName}</ListGroup.Item>)
                })}
            // </ListGroup> */}
        </>
        
        
    );
}

export default RepoList;
