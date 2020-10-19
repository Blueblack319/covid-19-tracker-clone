import React from 'react'

import { Card, CardContent, Typography } from '@material-ui/core';

import "./infoBox.css";

function InfoBox({title, cases, total, clicked, active, casesType}) {
    return (
        <Card className={`infoBox ${active && `infoBox--${casesType}--selected`}`} onClick={clicked}>
            <CardContent>
                <Typography color="textSecondary">{title}</Typography>
                <div className={`infoBox__cases infoBox__cases--${casesType}`}>{cases}</div>
                <Typography color="textSecondary" className="infoBox__total">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
