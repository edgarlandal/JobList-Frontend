type ValidationError = {
    loc: (string | number)[];
    msg: string;
    type?: string;
}

type LoginErrorResponse = {
    detail?: string | ValidationError[];
}