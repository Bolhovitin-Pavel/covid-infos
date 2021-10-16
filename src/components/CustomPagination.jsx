import React from "react";
import ReactPaginate from "react-paginate";


function CustomPagination(props) {

    return (
        <ReactPaginate
        initialPage={props.initialPage}
        forcePage={props.initialPage}
        pageCount={props.pageCount}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}

        previousLabel={props.pageCount < 3 ? "" : "<<"}
        breakLabel={"..."}
        nextLabel={props.pageCount < 3 ? "" : ">>"}

        containerClassName={"pagination justify-content-end mb-0"}

        previousClassName={props.pageCount < 3 ? undefined : "page-item"}
        pageClassName={"page-item"}
        activeClassName={"page-item active"}
        disabledClassName={"page-item disable"}
        breakClassName={"page-item"}
        nextClassName={props.pageCount < 3 ? undefined : "page-item"}

        previousLinkClassName={props.pageCount < 3 ? undefined : "page-link"}
        pageLinkClassName={"page-link"}
        activeLinkClassName={"page-link"}
        breakLinkClassName={"page-link"}
        nextLinkClassName={props.pageCount < 3 ? undefined : "page-link"}

        onPageChange={props.onPageChange}
        />
    );
}


export default CustomPagination;
