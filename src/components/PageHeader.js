import React from 'react';

const PageHeader = (props) => {
    return (
        <div className="page-header">
            <div className="page-header-text">{props.headerText}</div>
        </div>
    );
}

export default PageHeader;