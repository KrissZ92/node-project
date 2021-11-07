import db from '../database/connection.js'

class Department{
    constructor({id_department,department,state}){
        this.id_department = this.valId(id_department)
        this.department = this.valDepartment(department)
        this.state = this.valState(state)
    }
    valId(id){
        if (!id) return 
        if (typeof(id)!=='number') return 
        return id
    }
    valDepartment(department){
        if (!department) return
        if (department.length>30) return console.error('Nombre del departamento excede los 30 cáracteres')
        return department
    }
    valState(state){
        if (!state) return
        if (typeof(state)!=='number' || state>1) return 
        return state
    }
}

function index(req,res){
    db.query('select * from departments',(err,departments)=>{
        if (err) return console.log(`Ocurrió un eror obteniendo los departamentos: ${err}`)
        console.log(departments)
        res.render('departments',{
            departments:departments
        })
    })
    /* db.query('select * from employees where id_employee=1 or id_employee=2',(err,rows)=>{
        if (err) return console.log(`Ocurrió un eror al ejecutar consulta: ${err}`)
        let employee = new Employee(rows[1])
        console.log(employee)
        res.send(employee)
    }) */
}

function getAll(req,res){
    db.query('select * from departments',(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error obteniendo los departamentos: ${err}`)
        res.send(rows)
    })
}

function getAllActives(req,res){
    db.query('select * from departments where state=1',(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error obteniendo los departamentos: ${err}`)
        res.send(rows)
    })
}

function getById(req,res){
    const id = req.params.id
    if (!id) return res.status(400).send('Id no proporcionado') 
    db.query(`select * from departments where id_department=${id}`,(err,department)=>{
        if (err) return res.status(500).send(`Ocurrió un error obteniendo el departamento: ${err}`)
        db.query('select * from departments',(er,departments)=>{
            if (er) return console.log(`Ocurrió un eror obteniendo los departamentos: ${er}`)
            res.render('departments',{
                departments:departments,
                department:department[0],
                edit:1
            })
        })
    })
}

/* class Employee{
    constructor({id_employee,name,lastname,id_department,phone,state}){
        this.id_employee = id_employee
        this.name = name
        this.lastname = lastname
        this.id_department = id_department
        this.phone = phone
        this.state = state
        this.valName(name)
    }} */

function create(req,res){
    const {department,state} = req.body
    if (!department || !state) return res.status(400).send('Campos obligatorios') 
    db.query(`insert into departments (department,state) 
            values ('${department}',${state})`,(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error creando el departamento: ${err}`)
        return res.redirect('/departments')
    })
}

function update(req,res){
    const id_department = req.params.id
    const {department,state} = req.body
    console.log(id_department,department,state)
    if (!id_department || !department || !state) return res.status(400).send('Campos obligatorios') 
    db.query(`update departments set department='${department}',state=${state} 
        where id_department=${id_department}`,(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error actualizando el departamento: ${err}`)
        return res.redirect('/departments')
    })
}

function changeState(req,res){
    const id_department = req.params.id
    if (!id_department) return res.status(400).send('Id del departamento no proporcionado') 
    db.query(`update departments set state=if((select state from departments where id_department=${id_department})=1,0,1) 
        where id_department=${id_department}`,(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error borrando el departamento: ${err}`)
        res.redirect('/departments')
    })
}


export default {
    index,
    getAll,
    getAllActives,
    getById,
    create,
    update,
    changeState,
}