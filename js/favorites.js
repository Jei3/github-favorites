import { GithubUser } from "./GithubUser.js";


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load();

        GithubUser.search().then(user => console.log(user))
    }

    load() {
        this.entries = JSON.parse(
            localStorage.getItem('@github-favorites:')) || []
        
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(
            this.entries
        ))
    }

    async add(username) {
        try{

            const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

            if(userExists) {
                throw new   Error("Usuário já cadastrado!")
            }

            // vai no github buscar as informações
            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [ user, ...this.entries]
            this.update()
            this.save()


        }catch(error) {
            alert(error.message)
        }
    }

    delete(user) {

        const filteredEntries = this.entries.filter(entry =>
            entry.login !== user.login)

            this.entries = filteredEntries
            this.update()
            this.save(  )
    }
}


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')

            this.add(value)
        }
    }


    update() {
        this.removeAllTr()


            
        this.entries.forEach(user => {
                const row = this.createRow()
                console.log(row)
                
                row.querySelector('.user img').src = `https://github.com/${user.login}.png`
                row.querySelector('.user img').alt = `Imagem de ${user.name}`
                row.querySelector('.user a').href = `https://github.com/${user.login}`
                row.querySelector('.user p').textContent = user.name
                row.querySelector('.user span').textContent = user.login
                row.querySelector('.repositories').textContent = user.public_repos
                row.querySelector('.followers').textContent = user.followers
            
                row.querySelector('.remove').onclick = () => {
                    const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                    if(isOk) {
                        this.delete(user)
                    }
                }
                
                this.tbody.append(row);
            })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/jei3.png" alt="">
                <a href="https://github.com/jei3" target="_blank">
                    <p>Jei3</p>
                    <span>Jabriel Schafer</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                854
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
            

        `

         return tr;
    }


    removeAllTr() {
         this.tbody.querySelector('table tbody')

        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }
}



