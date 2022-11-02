import React from "react";
import "./App.scss";

import commentsData from "./data.json";

let currentUser = commentsData.currentUser;

function isAuthor(name: string): boolean {
  return commentsData.currentUser.username === name;
}

function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

function App() {
  const [replyString, setReplyString] = React.useState("");
  const [commentsList, setCommentsList] = React.useState(commentsData.comments);

  function onChangeReply(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setReplyString(event.target.value);
  }

  function onClickAdd() {
    let newComment = {
      id: getTimestampInSeconds(),
      content: replyString,
      createdAt: "today",
      score: 0,
      user: {
        image: {
          png: currentUser.image.png,
          webp: currentUser.image.webp,
        },
        username: currentUser.username,
      },
      replies: [],
    };

    setCommentsList((state) => [...state, newComment]);
    setReplyString("");
  }

  function deleteParentComment(commendID: number) {
    let newList = commentsList.filter((comment) => comment.id !== commendID);
    setCommentsList(newList);
  }

  function deleteChildComment(commendID: number, parentComment: number) {
    let parentIndex = commentsList.findIndex(
      (comment) => comment.id === parentComment
    );
    commentsList[parentIndex].replies = commentsList[
      parentIndex
    ].replies.filter((reply) => reply.id !== commendID);
    setCommentsList((state) => [...commentsList]);
  }

  function addNewReply(commendID: number, newReply: any) {
    let parentIndex = commentsList.findIndex(
      (comment) => comment.id === commendID
    );

    commentsList[parentIndex].replies.push({
      id: getTimestampInSeconds(),
      ...newReply,
    });

    setCommentsList((state) => [...commentsList]);
  }

  return (
    <>
      <main>
        <div className="margin-left"></div>
        <div className="container">
          <div className="comments">
            {commentsList.map((comment, index) => (
              <React.Fragment key={index}>
                <CommentComponent
                  comment={comment}
                  deleteParentComment={deleteParentComment}
                  addNewReply={addNewReply}
                />

                {comment.replies.length > 0 && (
                  <div className="comments-item-replies-container">
                    <div className="comments-item-replies-tab">
                      <div className="comments-item-replies-tab-sperator"></div>
                    </div>
                    <div className="comments-item-replies">
                      {comment.replies.map((reply, index) => (
                        <CommentComponent
                          key={index}
                          comment={reply}
                          parentComment={comment.id}
                          deleteChildComment={deleteChildComment}
                          addNewReply={addNewReply}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="add-comment">
            <div className="add-comment-avatar">
              <img src={commentsData.currentUser.image.png} alt="" />
            </div>
            <div className="add-comment-input">
              <textarea
                onChange={onChangeReply}
                rows={5}
                placeholder="Add a comment..."
                value={replyString}
              />
            </div>
            <div className="add-comment-button">
              <button onClick={onClickAdd}>SEND</button>
            </div>
            <div className="add-comment-footer">
              <div className="add-comment-footer-avatar">
                <img src={commentsData.currentUser.image.png} alt="" />
              </div>
              <div className="add-comment-footer-button">
                <button onClick={onClickAdd}>SEND</button>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-right"></div>
      </main>
    </>
  );
}

function CommentComponent({
  comment,
  parentComment,
  deleteParentComment,
  deleteChildComment,
  addNewReply,
}: any) {
  const [showReply, setShowReply] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [newReply, setNewRply] = React.useState("");
  const [commentString, setCommentString] = React.useState(comment.content);
  const [editString, setEditString] = React.useState(comment.content);
  const modalRef = React.useRef<HTMLDivElement>(null);

  function onClickDelete() {
    if (modalRef.current) {
      modalRef.current.style.display = "block";
    }
  }

  function onClickConfirmDelete() {
    if (parentComment === undefined) {
      deleteParentComment(comment.id);
    } else {
      deleteChildComment(comment.id, parentComment);
    }

    onClickModal();
  }

  function onClickModal() {
    if (modalRef.current) {
      modalRef.current.style.display = "none";
    }
  }

  function onClickShowReply() {
    setShowReply(!showReply);
    setNewRply("@".concat(comment.user.username));
  }

  function onClickReply() {
    let addReply = {
      content: newReply,
      createdAt: "today",
      score: 0,
      user: { ...currentUser },
      replies: [],
    };

    if (parentComment === undefined) {
      addNewReply(comment.id, addReply);
    } else {
      addNewReply(parentComment, addReply);
    }

    setShowReply(false);
    setNewRply("");
  }

  function onChangeNewReply(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewRply(event.target.value);
  }

  function onClickBox(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  function onClickEdit() {
    setShowEdit(!showEdit);
    setEditString(commentString);
  }

  function onClickUpdate() {
    setCommentString(editString);
    setShowEdit(false);
  }

  function onChangeComment(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setEditString(event.target.value);
  }

  return (
    <>
      <div className="comments-item">
        <div className="comments-item-votes">
          <div className="comments-item-votes-up">
            <img src="./images/icon-plus.svg" alt="" />
          </div>
          <div className="comments-item-votes-score">{comment.score}</div>
          <div className="comments-item-votes-down">
            <img src="./images/icon-minus.svg" alt="" />
          </div>
        </div>
        <div className="comments-item-main">
          <div
            onClick={onClickModal}
            id="myModal"
            className="page-modal"
            ref={modalRef}
          >
            <div onClick={onClickBox} className="page-modal-box">
              <h3>Delete comment</h3>
              <p>
                Are you sure you want to delete this comment? This will remove
                the comment and can't be undone
              </p>
              <div className="page-modal-box-footer">
                <button
                  onClick={onClickModal}
                  className="page-modal-box-footer-cancel"
                >
                  NO, CANCEL
                </button>
                <button
                  onClick={onClickConfirmDelete}
                  className="page-modal-box-footer-delete"
                >
                  YES, DELETE
                </button>
              </div>
            </div>
          </div>
          <div className="comments-item-main-header">
            <img
              className="comments-item-main-header-avatar"
              src={comment.user.image.png}
              alt=""
            />
            <span className="comments-item-main-header-name">
              {comment.user.username}
            </span>
            {isAuthor(comment.user.username) === true && (
              <span className="comments-item-main-header-you">you</span>
            )}
            <span className="comments-item-main-header-date">
              {comment.createdAt}
            </span>
            <div className="comments-item-main-header-end">
              {isAuthor(comment.user.username) === true ? (
                <>
                  <button
                    onClick={onClickDelete}
                    className="comments-item-main-header-end-delete"
                  >
                    <img src="./images/icon-delete.svg" alt="" /> Delete
                  </button>
                  <button
                    onClick={onClickEdit}
                    className="comments-item-main-header-end-reply"
                  >
                    <img src="./images/icon-edit.svg" alt="" /> Edit
                  </button>
                </>
              ) : (
                <button
                  onClick={onClickShowReply}
                  className="comments-item-main-header-end-reply"
                >
                  <img src="./images/icon-reply.svg" alt="" /> Reply
                </button>
              )}
            </div>
          </div>
          <div className="comments-item-main-body">
            {showEdit ? (
              <>
                <textarea
                  onChange={onChangeComment}
                  className="comments-item-main-body-edit"
                  value={editString}
                  rows={4}
                />
                <button
                  onClick={onClickUpdate}
                  className="comments-item-main-body-update"
                >
                  UPDATE
                </button>
              </>
            ) : (
              commentString
            )}
          </div>
          <div className="comments-item-main-footer">
            <div className="comments-item-main-footer-votes">
              <div className="comments-item-main-footer-votes-up">
                <img src="./images/icon-plus.svg" alt="" />
              </div>
              <div className="comments-item-votes-score">{comment.score}</div>
              <div className="comments-item-main-footer-votes-down">
                <img src="./images/icon-minus.svg" alt="" />
              </div>
            </div>
            <div className="comments-item-main-footer-end">
              {isAuthor(comment.user.username) === true ? (
                <>
                  <button
                    onClick={onClickDelete}
                    className="comments-item-main-header-end-delete"
                  >
                    <img src="./images/icon-delete.svg" alt="" /> Delete
                  </button>
                  <button
                    onClick={onClickEdit}
                    className="comments-item-main-header-end-reply"
                  >
                    <img src="./images/icon-edit.svg" alt="" /> Edit
                  </button>
                </>
              ) : (
                <button
                  onClick={onClickShowReply}
                  className="comments-item-main-header-end-reply"
                >
                  <img src="./images/icon-reply.svg" alt="" /> Reply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showReply && (
        <div className="add-comment">
          <div className="add-comment-avatar">
            <img src={commentsData.currentUser.image.png} alt="" />
          </div>
          <div className="add-comment-input">
            <textarea
              onChange={onChangeNewReply}
              value={newReply}
              rows={5}
              placeholder="Add a comment..."
            />
          </div>
          <div className="add-comment-button">
            <button onClick={onClickReply}>REPLY</button>
          </div>
          <div className="add-comment-footer">
            <div className="add-comment-footer-avatar">
              <img src={commentsData.currentUser.image.png} alt="" />
            </div>
            <div className="add-comment-footer-button">
              <button onClick={onClickReply}>REPLY</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
