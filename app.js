const yargs = require('yargs');
const fs = require('fs');

const file = 'tasks.json';

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, '[]', 'utf8');
}

const loadTasks = () => JSON.parse(fs.readFileSync(file, 'utf8'));

const saveTasks = (tasks) => fs.writeFileSync(file, JSON.stringify(tasks), 'utf8');

const getFormattedTimestamp = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

yargs
  .usage(`\nPenggunaaan : 
  \t$0 <cmd> [options]`)
  .version('1.0.0')
  .command({
    command: 'add',
    describe: 'Menambahkan tugas baru',
    builder: {
      task: {
        describe: 'Deskripsi tugas',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      const tasks = loadTasks();
      const timestamp = getFormattedTimestamp();
      tasks.push({ task: argv.task, done: false, addedAt: timestamp });
      saveTasks(tasks);
      console.log('Tugas ditambahkan:', argv.task, ' pada', timestamp);
    },
  })
  .command({
    command: 'list',
    describe: 'Menampilkan daftar tugas',
    handler() {
      const tasks = loadTasks();
      console.log('Daftar Tugas:');
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. [${task.done ? 'X' : ' '}] ${task.task} (Added: ${task.addedAt}, Done: ${task.doneAt || 'Not done'}, Deleted: ${task.deletedAt || 'Not deleted'})`);
      });
    },
  })
  .command({
    command: 'done',
    describe: 'Menandai tugas sebagai selesai',
    builder: {
      index: {
        describe: 'Nomor tugas',
        demandOption: true,
        type: 'number',
      },
    },
    handler(argv) {
      const tasks = loadTasks();
      if (argv.index >= 1 && argv.index <= tasks.length) {
        tasks[argv.index - 1].done = true;
        tasks[argv.index - 1].doneAt = getFormattedTimestamp();
        saveTasks(tasks);
        console.log('Tugas selesai:', tasks[argv.index - 1].task, ' pada', tasks[argv.index - 1].doneAt);
      } else {
        console.log('Nomor tugas tidak valid.');
      }
    },
  })
  .command({
    command: 'delete',
    describe: 'Menghapus tugas',
    builder: {
      index: {
        describe: 'Nomor tugas',
        demandOption: true,
        type: 'number',
      },
    },
    handler(argv) {
      const tasks = loadTasks();
      if (argv.index >= 1 && argv.index <= tasks.length) {
        const deletedTask = tasks.splice(argv.index - 1, 1);
        deletedTask[0].deletedAt = getFormattedTimestamp();
        saveTasks(tasks);
        console.log('Tugas dihapus:', deletedTask[0].task, ' pada', deletedTask[0].deletedAt);
      } else {
        console.log('Nomor tugas tidak valid.');
      }
    },
  })
  .command({
    command: 'update',
    describe: 'Mengupdate tugas',
    builder: {
      index: {
        describe: 'Nomor tugas',
        demandOption: true,
        type: 'number',
      },
      task: {
        describe: 'Deskripsi tugas yang baru',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      const tasks = loadTasks();
      if (argv.index >= 1 && argv.index <= tasks.length) {
        tasks[argv.index - 1].task = argv.task;
        tasks[argv.index - 1].updatedAt = getFormattedTimestamp();
        saveTasks(tasks);
        console.log('Tugas diupdate:', argv.task, ' pada', tasks[argv.index - 1].updatedAt);
      } else {
        console.log('Nomor tugas tidak valid.');
      }
    },
  })
  .demandCommand()
  .help()
  .argv;
