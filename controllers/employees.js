import db from '../database/connection.js'

class Employee{
    constructor({id_employee,name,lastname,id_department,phone,state}){
        this.id_employee = this.valId(id_employee)
        this.name = this.valName(name)
        this.lastname = this.valLastname(lastname)
        this.id_department = this.valId_department(id_department)
        this.phone = this.valPhone(phone)
        this.state = this.valState(state)
    }
    valId(id){
        if (!id) return 
        if (typeof(id)!=='number') return 
        return id
    }
    valName(name){
        if (!name) return
        if (name.length>30) return console.error('Nombre excede los 30 cáracteres')
        return name
    }
    valLastname(lastname){
        if (!lastname) return
        if (lastname.length>30) return console.error('Apellido excede los 30 cáracteres')
        return lastname
    }
    valId_department(id){
        if (!id) return 
        if (typeof(id)!=='number') return 
        return id
    }
    valPhone(phone){
        if (!phone) return
        if (phone.length>30) return console.error('Télefono excede los x cáracteres')
        return phone
    }
    valState(state){
        if (!state) return 
        if (typeof(state)!=='number' || state>1) return 
        return state
    }
}

function index(req,res){
    db.query('select * from employees',(err,employees)=>{
        if (err) return console.log(`Ocurrió un eror obteniendo los empleados: ${err}`)
        db.query('select * from departments',(er,departments)=>{
            if (er) return console.log(`Ocurrió un eror obteniendo los departamentos: ${err}`)
            res.render('employees',{
                employees:employees,
                departments:departments
            })
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
    db.query('select * from employees',(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error obteniendo los empleados: ${err}`)
        res.send(rows)
    })
}

function getAllActives(req,res){
    db.query('select * from employees where state=1',(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error obteniendo los empleados: ${err}`)
        res.send(rows)
    })
}

function getById(req,res){
    const {id} = req.params
    if (!id) return res.status(400).send('Id no proporcionado') 
    db.query(`select * from employees where id_employee=${id}`,(err,employee)=>{
        if (err) return res.status(500).send(`Ocurrió un error obteniendo el empleado: ${err}`)
        db.query('select * from employees',(er,employees)=>{
            if (er) return console.log(`Ocurrió un eror obteniendo los empleados: ${er}`)
            db.query('select * from departments',(e,departments)=>{
                if (e) return console.log(`Ocurrió un eror obteniendo los departamentos: ${er}`)
                res.render('employees',{
                    employees:employees,
                    departments:departments,
                    employee:employee[0],
                    edit:1
                })
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
    const {name,lastname,id_department,phone,state} = req.body
    if (!name || !lastname || !id_department || !phone || !state) return res.status(400).send('Campos obligatorios') 
    db.query(`insert into employees (name,lastname,id_department,phone,state) 
            values ('${name}','${lastname}',${id_department},'${phone}',${state})`,(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error creando el empleado: ${err}`)
        return res.redirect('/employees')
    })
}

function update(req,res){
    const id_employee = req.params.id
    const {name,lastname,id_department,phone,state} = req.body
    if (!id_employee || !name || !lastname || !id_department || !phone || !state) return res.status(400).send('Campos obligatorios') 
    db.query(`update employees set name='${name}',lastname='${lastname}',id_department=${id_department},phone='${phone}',state=${state} 
        where id_employee=${id_employee}`,(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error actualizando el empleado: ${err}`)
        res.redirect('/employees')
    })
}

function changeState(req,res){
    const id_employee = req.params.id
    if (!id_employee) return res.status(400).send('Id del empleado no proporcionado') 
    db.query(`update employees set state=if((select state from employees where id_employee=${id_employee})=1,0,1) 
        where id_employee=${id_employee}`,(err,rows)=>{
        if (err) return res.status(500).send(`Ocurrió un error borrando el empleado: ${err}`)
        res.redirect('/employees')
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