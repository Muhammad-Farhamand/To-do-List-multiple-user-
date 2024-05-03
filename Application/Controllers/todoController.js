const Pool = require('../../connection');

exports.getTasks = async (req, res) => {
    try{
        const { user_id } = req.params;

        const [ todo ] = await Pool.query(`
        SELECT * FROM todos
        WHERE user_id = ?
        `, [ user_id ]);

        res.status(201).json({
            status: 'success',
            data: {
                todo
            }
        });
    }
    catch(err){
        console.error('Error Getting tasks: ', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while getting tasks!'
        });
    }
};

exports.pushTask = async (req, res, next) => {
    try{
        const { user_id } = req.params;
        const { task , completed } = req.body;


        const [ push ] = await Pool.query(`
        INSERT INTO todos (user_id, task, completed)
        VALUES (?,?,?)
        `, [user_id, task, completed])

        res.status(201).json({
            status: 'success',
            data: {
                push
            }
        });
    }
    catch(err){
        console.error('Error pushing task', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while pushing task!'
        });
    }
};

exports.pullTask = async (req, res, next) => {
    try{
        const { user_id } = req.params;
        const { task, completed } = req.body;

        const [ pull ] = await Pool.query(`
        DELETE FROM todos
        WHERE user_id = ? AND task = ? AND completed = ?
        `, [user_id, task, completed]);

        res.status(201).json({
            success: 'success',
            data: {
                pull
            }
        });

    }
    catch(err){
        console.error('Error pulling task', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while pulling task!'
        });
    }
};

exports.updateTask = async (req, res, next) => {
    try{
        const { user_id } = req.params;
        const { task, completed } = req.body;

        let toggle = false
        if(completed == toggle){
            toggle = true
        }

        const [ update ] = await Pool.query(`
        UPDATE todos
        SET completed = ?
        WHERE user_id = ? AND task = ? AND completed = ?
        `, [toggle, user_id, task, completed]);

        res.status(201).json({
            success: 'success',
            data: {
                update
            }
        });
    }
    catch(err){
        console.error('Error updating task', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating task!'
        });
    }
}