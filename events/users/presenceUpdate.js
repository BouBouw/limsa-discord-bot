module.exports = {
	name: 'presenceUpdate',
	once: false,
execute: async (oldPresence, newPresence, client) => {
    await roleCustomStatus();

    async function roleCustomStatus() {
            let status = newPresence.activities.map(a => a.state);
            if(status[0] && status[0].includes('.gg/amarillo')) {
                await newPresence.member.roles.add('1082453048682627142')
                .catch((err) => { return; })
            } else {
                await newPresence.member.roles.remove('1082453048682627142')
                .catch((err) => { return; })
            }
    }
    }
}