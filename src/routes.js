import IndexPage from "./components/pages/IndexPage";
import Auth from "./components/pages/Auth";
import Admin from "./components/pages/Admin";
import UserPage from "./components/pages/UserPage";
import ResetPass from "./components/pages/ResetPass";
import CompetitionEditPage from "./components/pages/CompetitionEditPage";
import SportTricksPage from "./components/pages/SportTricksPage";
import CompetitionTricksPage from "./components/pages/CompetitionTricksPage";
import CompetitionCriteriaPage from "./components/pages/CompetitionCriteriaPage";
import CompetitionContestantsPage from "./components/pages/CompetitionContestantsPage";
import CompetitionGroupsPage from "./components/pages/CompetitionGroupsPage";
import CompetitionControlPage from "./components/pages/CompetitionControlPage";
import HeatPage from "./components/pages/HeatPage";
import HostPage from "./components/pages/hostPage";
import ContestantPage from "./components/pages/ContestantPage";
import CompetitionPublicPage from "./components/pages/competitionPublicPage";
import TeamPublicPage from "./components/pages/TeamPublicPage";
import GroupPublicPage from "./components/pages/GroupPublicPage";



export const publicRoutes = [
    {path: '/', element: <IndexPage/>},
    {path: '/login', element: <Auth/>},
    {path: '/reg', element: <Auth/>},
    {path: '/reset_pass', element: <ResetPass/>},
    {path: '/reset_pass/:activationLink', element: <ResetPass/>},
    {path: '/host/:competitionId', element: <HostPage/>},
    {path: '/competition/:competitionId', element: <CompetitionPublicPage/>},
    {path: '/contestant/:id', element: <ContestantPage/>},
    {path: '/team/:teamId', element: <TeamPublicPage />},
    {path: '/group/:groupId', element: <GroupPublicPage />},
]

export const authRoutes = [
    {path: '/', element: <IndexPage/>},
    {path: '/user', element: <UserPage/>},
    {path: '/host/:competitionId', element: <HostPage/>},
    {path: '/contestant/:id', element: <ContestantPage/>},
    {path: '/competition/:competitionId', element: <CompetitionPublicPage/>},
    {path: '/team/:teamId', element: <TeamPublicPage />},
    {path: '/group/:groupId', element: <GroupPublicPage />},
]

export const adminRoutes = [
    {path: '/admin', element: <Admin/>},
    {path: '/edit_competition/:competitionId', element: <CompetitionEditPage/>},
    {path: '/sport_tricks/:id', element: <SportTricksPage/>},
    {path: '/competition_tricks/:competitionId', element: <CompetitionTricksPage/>},
    {path: '/competition_criteria/:competitionId', element: <CompetitionCriteriaPage/>},
    {path: '/competition_teams/:competitionId', element: <CompetitionContestantsPage/>},
    {path: '/competition_contestants/:competitionId', element: <CompetitionContestantsPage/>},
    {path: '/competition_groups/:competitionId', element: <CompetitionGroupsPage/>},
    {path: '/competition_control/:competitionId', element: <CompetitionControlPage/>},
    {path: '/heat/:heatId', element: <HeatPage/>},


]