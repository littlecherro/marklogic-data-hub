import React from "react";
import Chiclet from "../Chiclet/Chiclet";
import DateTime from "../DateTime/DateTime";
import Value from "../Value/Value";
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import "./MetadataValue.scss";
import {getValByConfig} from "../../util/util";
import _ from "lodash";

type Props = {
  config?: any;
  data?: any;
  style?: any;
};

/**
 * Component for showing metadata in the form of square icons.
 *
 * @component
 * @example
 * {
 *  "metadata": [
        {
        "type": "block",
        "color": "#5d6aaa",
        "placement": "after",
        "popover": {
            "title": "Sources",
            "dataPath": "source",
            "placement": "right",
            "cols": [
            {
                "path": "name",
                "type": "chiclet",
                "colors": {
                "New York Times": "#d5e1de",
                "USA Today": "#ebe1fa",
                "Los Angeles Times": "#cae4ea",
                "Wall Street Journal": "#fae9d3",
                "Washington Post": "#fae3df",
                "Chicago Tribune": "#f0f6d9"
                }
            },
            {
                "path": "ts",
                "type": "datetime",
                "format": "yyyy-MM-dd"
            }
            ]
        }
        }
    ]
 * }
 */
const MetadataValue: React.FC<Props> = (props) => {

    const value = getValByConfig(props.data, props.config);
    let popoverData = props?.config?.popover ? _.get(props.data, props?.config?.popover?.dataPath, []):[];
    popoverData = _.isNil(popoverData) ? null : (Array.isArray(popoverData) ? popoverData : [popoverData]);

    let metadataStyle: any = props.style ? props.style : props.config?.style ? props.config.style : {};
    metadataStyle = {...metadataStyle, backgroundColor: props.config.color ? props.config.color : "lightgray"};

    const displayValue = (data, config) => {
        if (config.type === "datetime") {
            return <DateTime config={config} data={data} />;
        } else if (config.type === "chiclet") {
            return <Chiclet config={config} data={data} />;
        }
        return <Value data={data} config={config} />;
    };

    const getPopover = () => {
        if (props.config.popover) { return (
            <Popover id="popover-basic">
                <Popover.Header>{props.config.popover.title}</Popover.Header>
                <Popover.Body>
                    <Table size="sm"><tbody>{popoverData.map((d, i) => {return (
                        <tr key={"row-" + i}>
                            {props.config.popover.cols.map((col, i2) => { return (
                                <td key={"col-" + i2} className={col.type}>{displayValue(d, col)}</td>
                            )})}
                        </tr>
                    )})}</tbody></Table>
                </Popover.Body>
            </Popover>
        )} else {
            return <div></div>;
        }
    };

    const getMetadata = () => { 
        if(!value) return
        return (
            <div 
                className={props.config.popover ? "hasPopover" : ""} 
                style={metadataStyle}
            >
                {value}
            </div>
        )
    };

    const getOverlay = () => { return (
        <OverlayTrigger 
            trigger="click" 
            placement={props?.config?.popover?.placement ? props.config.popover.placement : "right"} 
            overlay={getPopover()}
        >
            <div className="hasPopover"
                style={metadataStyle}
            >
                {popoverData.length}
            </div>
        </OverlayTrigger>
    )};

    return (
        <span className="MetadataValue">
            { props.config.popover && popoverData.length > 0 ? getOverlay() : getMetadata() }
        </span>
    );
};

export default MetadataValue;