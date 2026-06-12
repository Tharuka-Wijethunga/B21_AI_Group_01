import { resetAndSeed } from './db.setup'

resetAndSeed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
