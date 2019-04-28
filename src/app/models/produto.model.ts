export class Produto {
    constructor(init?: Partial<Produto>) {
        Object.assign(this, init);
    }

    id:string
    nome:string
    descricao:string
    quantidade:number
    categoria:string
    valorEntrada:number
    valorSaida:number
    foto: File | string
    dtCadastro:Date
    esta_ativo:boolean
}
