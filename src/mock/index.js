import { createServer } from 'miragejs'
import appConfig from 'configs/app.config'

import { signInUserData } from './data/authData'
import {
    projectList,
    scrumboardData,
    issueData,
    projectDashboardData,
} from './data/projectData'
import { authFakeApi, projectFakeApi } from './fakeApi'

const { apiPrefix } = appConfig

export default function mockServer({ environment = 'test' }) {
    return createServer({
        environment,
        seeds(server) {
            server.db.loadData({
                signInUserData,
                projectDashboardData
            })
        },
        routes() {
            this.urlPrefix = ''
            this.namespace = ''
            this.passthrough((request) => {
                let isExternal = request.url.startsWith('http')
                return isExternal
            })
            this.passthrough()

            authFakeApi(this, apiPrefix)
            projectFakeApi(this, apiPrefix)

        },
    })
}
