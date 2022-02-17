import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../store/UserContext";
import Metrics from "../components/Metrics/Metrics";
import SearchBox from "../components/SearchBox/SearchBox";
import Saved from "../components/Saved/Saved";
import New from "../components/New/New";
import Recent from "../components/Recent/Recent";
import Section from "../components/Section/Section";
import Loading from "../components/Loading/Loading";
import {getRecent} from "../api/api";
import {getSaved} from "../api/api";
import {getSummary} from "../api/api";
import "./Dashboard.scss";

type Props = {};

const Dashboard: React.FC<Props> = (props) => {

  const userContext = useContext(UserContext);

  const [config, setConfig] = useState<any>(null);
  const [recent, setRecent] = useState<any>({});
  const [saved, setSaved] = useState<any>({});
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    setRecent(getRecent({}));
    setSaved(getSaved({}));
    setSummary(getSummary({}));
  }, []);

  useEffect(() => {
    setConfig(userContext.config);
  }, [userContext.config]);

  return (
    <div className="dashboard">

      {config?.dashboard ?   

      <div className="container-fluid">

        <div className="row">

            <Metrics data={summary.metrics} config={config.dashboard.metrics} />

        </div>

        <div className="row">

          <div className="col-lg">

            <Section title="Search">
                <h4 style={{marginBottom: "20px"}}>New Search</h4>
                <SearchBox config={config.searchbox} button="vertical" width="100%" />

                {config?.dashboard?.saved ? 
                  <div>
                    <div className="divider">- or -</div>
                    <div style={{marginTop: "20px"}}>
                      <h4>Saved Searches</h4>
                      <Saved data={saved} config={config.dashboard.saved} />
                    </div>
                  </div>
                : null}
            </Section>

          </div>

          <div className="col-lg">

            {config?.dashboard?.new ? 
              <Section title="What's New with Entities">
                <New />
              </Section>
            : null}

            {config?.dashboard?.recent ? 
              <Section title="Recently Visited">
                  <Recent data={recent} config={config.dashboard.recent} />
              </Section>
            : null}

          </div>

        </div>

      </div>

      : <Loading />}

    </div>
  );
};

export default Dashboard;
