import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import LayoutPage from '../components/layouts/layoutPage';

const AnalysisDashboard = dynamic(() => import('../atoms/analysis/analysisDashboard'));
const AnalysisMetasalt = dynamic(() => import('../atoms/analysis/analysisMetasalt'));
const AnalysisProjects = dynamic(() => import('../atoms/analysis/analysisProjects'));
const AnalysisEarnings = dynamic(() => import('../atoms/analysis/analysisEarnings'));
const AnalysisTransactions = dynamic(() => import('../atoms/analysis/analysisTransactions'));

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Analysis = () => {

  const [tab, setTab] = useState(0);

  return (
    <LayoutPage>
      <div className='row color-b'>

        <div className='col-xl-2 col-md-3 col-sm-12 bg-1 p-4' style={{ minHeight: 800 }}>
          <br /><br />
          <div className={`f-20 fw-600 mt-3 cursor ${tab === 0 && 'color-purple'}`} onClick={() => setTab(0)}>Dashboard</div>
          <div className={`f-20 fw-600 mt-3 cursor ${tab === 1 && 'color-purple'}`} onClick={() => setTab(1)}>Metasalt</div>
          <div className={`f-20 fw-600 mt-3 cursor ${tab === 2 && 'color-purple'}`} onClick={() => setTab(2)}>Projects</div>
          <div className={`f-20 fw-600 mt-3 cursor ${tab === 3 && 'color-purple'}`} onClick={() => setTab(3)}>Earnings</div>
          <div className={`f-20 fw-600 mt-3 cursor ${tab === 4 && 'color-purple'}`} onClick={() => setTab(4)}>Transactions</div>
        </div>

        <div className='col-xl-10 col-md-9 col-sm-12 p-3'>
          {tab === 0 && <AnalysisDashboard />}
          {tab === 1 && <AnalysisMetasalt />}
          {tab === 2 && <AnalysisProjects />}
          {tab === 3 && <AnalysisEarnings />}
          {tab === 4 && <AnalysisTransactions />}
        </div>

        {/* <div className='col-xl-2 col-md-3 col-sm-12 bg-1 p-4'>
          <div className='f-20 fw-600 mt-3'>Featured Creators</div>
        </div> */}
      </div>
    </LayoutPage>
  );
}

export default Analysis;
