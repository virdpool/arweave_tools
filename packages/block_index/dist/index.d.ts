/// <reference types="node" />
declare type Hash_type = Buffer;
declare type Tx_root_type = Hash_type;
declare type Weave_size_type = bigint;
declare type Indep_hash_type = Hash_type;
export declare type Block_index_entity = {
    indep_hash: Indep_hash_type;
    weave_size: Weave_size_type;
    tx_root: Tx_root_type;
    block_size: bigint;
};
export declare abstract class Block_index {
}
export declare abstract class Block_index3 extends Block_index {
    abstract get_by_height_full(height: number): Block_index_entity | undefined;
    abstract get_by_height_indep_hash(height: number): Indep_hash_type | undefined;
    abstract get_by_height_weave_size(height: number): Weave_size_type | undefined;
    abstract get_by_height_tx_root(height: number): Tx_root_type | undefined;
    abstract get_by_height_indep_hash_orig(height: number): string | undefined;
    abstract get_by_height_weave_size_orig(height: number): string | undefined;
    abstract get_by_height_tx_root_orig(height: number): string | undefined;
    abstract get_by_chunk_offset_full(chunk_offset: bigint): Block_index_entity | undefined;
    abstract get_by_chunk_offset_indep_hash(chunk_offset: bigint): Indep_hash_type | undefined;
    abstract get_by_chunk_offset_weave_size(chunk_offset: bigint): Weave_size_type | undefined;
    abstract get_by_chunk_offset_tx_root(chunk_offset: bigint): Tx_root_type | undefined;
    abstract get_by_chunk_offset_indep_hash_orig(chunk_offset: bigint): string | undefined;
    abstract get_by_chunk_offset_weave_size_orig(chunk_offset: bigint): string | undefined;
    abstract get_by_chunk_offset_tx_root_orig(chunk_offset: bigint): string | undefined;
}
declare type Block_index3_json_entity = {
    tx_root: string;
    weave_size: string;
    hash: string;
};
declare type Block_idx_ret = {
    idx: number;
    block: Block_index3_json_entity;
};
export declare class Block_index3_json extends Block_index3 {
    block_list: Block_index3_json_entity[];
    chunk_offset_a: bigint;
    chunk_offset_b: bigint;
    load_from_original_format(json: any): void;
    get_by_height_full(height: number): Block_index_entity | undefined;
    get_by_height_indep_hash(height: number): Indep_hash_type | undefined;
    get_by_height_weave_size(height: number): Weave_size_type | undefined;
    get_by_height_tx_root(height: number): Tx_root_type | undefined;
    get_by_height_indep_hash_orig(height: number): string | undefined;
    get_by_height_weave_size_orig(height: number): string | undefined;
    get_by_height_tx_root_orig(height: number): string | undefined;
    _get_block_idx_by_chunk_offset(chunk_offset: bigint): Block_idx_ret | undefined;
    get_by_chunk_offset_full(chunk_offset: bigint): Block_index_entity | undefined;
    get_by_chunk_offset_indep_hash(chunk_offset: bigint): Indep_hash_type | undefined;
    get_by_chunk_offset_weave_size(chunk_offset: bigint): Weave_size_type | undefined;
    get_by_chunk_offset_tx_root(chunk_offset: bigint): Tx_root_type | undefined;
    get_by_chunk_offset_indep_hash_orig(chunk_offset: bigint): string | undefined;
    get_by_chunk_offset_weave_size_orig(chunk_offset: bigint): string | undefined;
    get_by_chunk_offset_tx_root_orig(chunk_offset: bigint): string | undefined;
}
export declare class Block_index3_json_manager {
    static save(block_index: Block_index3_json, path: string): Promise<void>;
    static load(block_index: Block_index3_json, path: string): Promise<void>;
    static save_sync(block_index: Block_index3_json, path: string): void;
    static load_sync(block_index: Block_index3_json, path: string): void;
    static download(peer_url_list: string[]): Promise<Block_index3_json>;
}
export {};
//# sourceMappingURL=index.d.ts.map