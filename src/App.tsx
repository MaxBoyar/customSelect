import UserForm from './components/userForm/UserForm.tsx'
import styled from 'styled-components'

const AppView = styled.div`
    height: 100vh;
    width: 100vw;
`
//endregion [[ Styles ]]

function App() {
    return (
        <AppView>
            <UserForm />
        </AppView>
    )
}

export default App
