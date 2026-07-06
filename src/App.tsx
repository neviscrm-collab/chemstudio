import { useAppStore } from './store/appStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { RightPanel } from './components/layout/RightPanel';
import { SearchOverlay } from './components/search/SearchOverlay';
import { NotificationsPanel } from './components/layout/NotificationsPanel';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectList } from './components/project/ProjectList';
import { ProjectDetail } from './components/project/ProjectDetail';
import { ExperimentList } from './components/experiment/ExperimentList';
import { ExperimentEditor } from './components/experiment/ExperimentEditor';
import { Publications } from './components/publications/Publications';
import { Patents } from './components/patents/Patents';
import { KnowledgeGraph } from './components/graph/KnowledgeGraph';
import { Timeline } from './components/timeline/Timeline';
import { MoleculeLibrary } from './components/libraries/MoleculeLibrary';
import { Settings } from './components/settings/Settings';
import './index.css';

function MainContent() {
  const { view } = useAppStore();

  switch (view) {
    case 'dashboard': return <Dashboard />;
    case 'projects': return <ProjectList />;
    case 'project_detail': return <ProjectDetail />;
    case 'experiments': return <ExperimentList />;
    case 'experiment_detail': return <ExperimentEditor />;
    case 'publications': return <Publications />;
    case 'patents': return <Patents />;
    case 'knowledge_graph': return <KnowledgeGraph />;
    case 'timeline': return <Timeline />;
    case 'libraries': return <MoleculeLibrary />;
    case 'settings': return <Settings />;
    default:
      return (
        <div className="flex-1 flex items-center justify-center bg-[#f8f9fb]">
          <p className="text-gray-400 text-sm">{view} — coming soon</p>
        </div>
      );
  }
}

function App() {
  const { view } = useAppStore();
  const isEditorView = view === 'experiment_detail' || view === 'knowledge_graph';

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {!isEditorView && <TopBar />}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <MainContent />
          <RightPanel />
        </div>
      </div>
      <SearchOverlay />
      <NotificationsPanel />
    </div>
  );
}

export default App;
