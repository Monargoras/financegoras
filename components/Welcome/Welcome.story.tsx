import Welcome from './Welcome'
import data from '../../dictionaries/en.json'

export default {
  title: 'Welcome',
}

export const Usage = () => <Welcome dictionary={data} />
