import * as React from 'react';
//import { useTheme } from '@mui/material/styles';
// import { useEffect } from 'react';


export default function Information(props) {
    //const theme = useTheme();

    // useEffect(() => {
    //     ckEditorThemeSync();
    // });

    // const ckEditorThemeSync = () => {
    //     setTimeout(() => {
    //         let elToApply = document.getElementsByTagName("a");

    //         if (elToApply) {
    //             const elArray = Array.from(elToApply);
    //             elArray.forEach(element => {
    //                 if (theme.palette.mode === "dark") {
    //                     element.setAttribute("style", "color: white !important; background-color: black !important;");
    //                 } else {
    //                     element.setAttribute("style", "color: black !important; background-color: white !important;");
    //                 }
    //             });
    //         }
    //     }, 250);
    // }

    return (
        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: props.content && props.content.data ? props.content.data.textContent : "" }} />
    );

};
