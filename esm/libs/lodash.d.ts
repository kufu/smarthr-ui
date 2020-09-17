export declare const merge: {
    <TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
    <TObject_1, TSource1, TSource2>(object: TObject_1, source1: TSource1, source2: TSource2): TObject_1 & TSource1 & TSource2;
    <TObject_2, TSource1_1, TSource2_1, TSource3>(object: TObject_2, source1: TSource1_1, source2: TSource2_1, source3: TSource3): TObject_2 & TSource1_1 & TSource2_1 & TSource3;
    <TObject_3, TSource1_2, TSource2_2, TSource3_1, TSource4>(object: TObject_3, source1: TSource1_2, source2: TSource2_2, source3: TSource3_1, source4: TSource4): TObject_3 & TSource1_2 & TSource2_2 & TSource3_1 & TSource4;
    (object: any, ...otherArgs: any[]): any;
};
export declare const range: {
    (start: number, end?: number | undefined, step?: number | undefined): number[];
    (end: number, index: string | number, guard: object): number[];
};
