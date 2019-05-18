export class Categoria {
    constructor(init?: Partial<Categoria>) {
        Object.assign(this, init);
    }
    id: string
    nome: string
    descricao: string
    foto: File | string
    esta_ativo: boolean
    dtCadastro:Date
}
