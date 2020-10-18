import React from 'react'

import { Card, CardContent, Typography } from '@material-ui/core';

import "./infoBox.css";

function InfoBox({title, cases, total}) {
    return (
        <Card className="infoBox">
            <CardContent>
                <Typography color="textSecondary">{title}</Typography>
                <div className="infoBox__cases">{cases}</div>
                <Typography color="textSecondary" className="infoBox__total">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
