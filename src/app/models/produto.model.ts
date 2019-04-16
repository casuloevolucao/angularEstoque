export class Produto {
    id:string
    nome:string
    descricao:string
    quantidade:number
    valor:number
    foto: File | string
    dtCadastro:Date
    esta_ativo:boolean
}
