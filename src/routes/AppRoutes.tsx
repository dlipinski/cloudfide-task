import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ListPage } from '../features/resources/pages/ListPage'
import { OverviewPage } from '../features/resources/pages/OverviewPage'
import { DetailsPage } from '../features/resources/pages/DetailsPage'
import { BasicInfoPage } from '../features/resources/pages/BasicInfoPage'
import { ProjectDetailsPage } from '../features/resources/pages/ProjectDetailsPage'

/** Application route table for the resource workflow. */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/resources" replace />} />
        <Route path="/resources" element={<ListPage />} />
        <Route path="/resources/:resourceId" element={<OverviewPage />} />
        <Route path="/resources/:resourceId/details" element={<DetailsPage />} />
        <Route path="/resources/:resourceId/basic-info" element={<BasicInfoPage />} />
        <Route
          path="/resources/:resourceId/project-details"
          element={<ProjectDetailsPage />}
        />
        <Route path="*" element={<Navigate to="/resources" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
