# e-learning-webapp
rebuild e-learning web app using TypeScript
## How to run
### 1. Run command `git clone https://github.com/tuanbui1506-kms/e-learning-webapp`
### 2. `yarn install`
### 3. Run SQL script
- Run `quanlykhoahoc.sql`
- Update `dbConfig` in `src/config/default.ts`
  - Modify `port`, `user`, `password` options
### 4. Run `yarn start`
- Console will print `Server is listening on Port:${PORT}` 
- Go to `http://localhost:${PORT}/`
### 5. Note
- Admin account: admin/admin
- Teacher account: hxk/1
