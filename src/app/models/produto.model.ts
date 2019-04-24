export class Produto {
    constructor(init?: Partial<Produto>) {
        Object.assign(this, init);
    }

    id:string
    nome:string
    descricao:string
    quantidade:number
    valor:number
    foto: File | string
    dtCadastro:Date
    esta_ativo:boolean
}
