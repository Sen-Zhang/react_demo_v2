(function (React, ReactDOM) {
  'use strict';

  var ToDo = React.createClass({
    getInitialState: function () {
      return {
        todoItems: [
          {
            id: 0,
            text: 'learn ruby',
            completed: true
          },
          {
            id: 1,
            text: 'learn react',
            completed: false
          }
        ],
        category: 'all'
      }
    },

    activeItems: function () {
      return this.state.todoItems.filter(function (item) {
        return !item.completed;
      });
    },

    completedItems: function () {
      return this.state.todoItems.filter(function (item) {
        return item.completed;
      });
    },

    itemsToShow: function () {
      var itemsToShow = [];

      switch (this.state.category) {
        case 'all':
          itemsToShow = this.state.todoItems;
          break;
        case 'active':
          itemsToShow = this.activeItems();
          break;
        case 'completed':
          itemsToShow = this.completedItems();
          break;
        default:
          itemsToShow = this.state.todoItems;
      }

      return itemsToShow;
    },

    getCategory: function () {
      return this.state.category;
    },

    getItemById: function (items, id) {
      return items.filter(function (item) {
        return (item.id === id)
      })[0]
    },

    getNewId: function () {
      var len = this.state.todoItems.length;

      return len === 0 ? 0 : parseInt(this.state.todoItems[len - 1].id) + 1;
    },

    updateItems: function (items) {
      this.setState({todoItems: items});
    },

    addTodoItem: function (text) {
      this.state.todoItems.push({
        id: this.getNewId(),
        text: text,
        completed: false
      });

      this.updateItems(this.state.todoItems);
    },

    updateItem: function (id, newText) {
      var item = this.getItemById(this.state.todoItems, id);

      if (item) {
        item.text = newText;
        this.updateItems(this.state.todoItems);
      }
    },

    removeItem: function (id) {
      var newItems = this.state.todoItems.filter(function (item) {
        return item.id !== id;
      });

      this.updateItems(newItems);
    },

    toggleItem: function (id) {
      var item = this.getItemById(this.state.todoItems, id);

      if (item) {
        item.completed = !item.completed;
        this.updateItems(this.state.todoItems);
      }
    },

    toggleAll: function (state) {
      this.state.todoItems.forEach(function (item) {
        item.completed = state;
      });

      this.updateItems(this.state.todoItems);
    },

    toggleCategory: function (category) {
      this.setState({category: category});
    },

    clearCompleted: function () {
      this.updateItems(this.activeItems());
    },

    render: function () {
      return (
        <div className="row row-fluid">
          <div className="col-sm-6 col-sm-offset-3">
            <ToDoHeader add={this.addTodoItem}/>
            <ToDoMain items={this.itemsToShow()}
                      toggleAll={this.toggleAll}
                      toggleItem={this.toggleItem}
                      updateItem={this.updateItem}
                      removeItem={this.removeItem}/>
            <ToDoFooter category={this.getCategory()}
                        activeCount={this.activeItems().length}
                        completedCount={this.completedItems().length}
                        toggleCategory={this.toggleCategory}
                        clearCompleted={this.clearCompleted}/>
          </div>
        </div>
      )
    }
  });

  var ToDoHeader = React.createClass({
    propTypes: {
      addToDoItem: React.PropTypes.func.isRequired
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      return false;
    },

    addToDoItem: function (e) {
      if (e.which === 13) {
        var text = e.target.value;

        if (text) {
          this.props.add(text);
          e.target.value = '';
        }
      }
    },

    render: function () {
      return (
        <header>
          <h2 className="text-center">ToDos</h2>
          <input type='text' className='form-control' autoFocus placeholder='What do you want to do?'
                 onKeyUp={this.addToDoItem}/>
        </header>
      )
    }
  });

  var ToDoMain = React.createClass({
    propTypes: {
      items: React.PropTypes.array.isRequired,
      toggleAll: React.PropTypes.func.isRequired,
      toggleItem: React.PropTypes.func.isRequired,
      updateItem: React.PropTypes.func.isRequired,
      removeItem: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
      return {
        items: []
      }
    },

    toggleAll: function (e) {
      this.props.toggleAll(e.target.checked);
    },

    render: function () {
      var todoMain = this;

      return (
        <section>
          <table className="table table-striped">
            <thead>
            <tr>
              <th><input type="checkbox" onChange={this.toggleAll}/></th>
              <th>Todo Item</th>
              <th>Remove</th>
            </tr>
            </thead>
            <tbody>
            {
              todoMain.props.items.map(function (item) {
                return <ToDoItem key={item.id}
                                 item={item}
                                 toggleItem={todoMain.props.toggleItem}
                                 updateItem={todoMain.props.updateItem}
                                 removeItem={todoMain.props.removeItem}/>;
              })
            }
            </tbody>
          </table>
        </section>
      )
    }
  });

  var ToDoItem = React.createClass({
    propTypes: {
      key: React.PropTypes.number.isRequired,
      item: React.PropTypes.object.isRequired,
      toggleItem: React.PropTypes.func.isRequired,
      updateItem: React.PropTypes.func.isRequired,
      removeItem: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {edit: false}
    },

    editItem: function () {
      this.setState({edit: true});
    },

    toggleItem: function () {
      this.props.toggleItem(this.props.item.id);
    },

    updateItem: function (e) {
      if (e.which === 13) {
        var newText = e.target.value;

        if (newText) {
          this.props.updateItem(this.props.item.id, newText);
          this.setState({edit: false});
        }
      }
    },

    removeItem: function () {
      this.props.removeItem(this.props.item.id);
    },

    render: function () {
      var textClass = this.props.item.completed ? 'item-completed' : 'text-info item-incompleted',
          showItem  = <span className={textClass} onDoubleClick={this.editItem}>{this.props.item.text}</span>,
          editItem  = <input className='form-control' onKeyUp={this.updateItem} defaultValue={this.props.item.text}/>;

      return (
        <tr>
          <td><input type="checkbox" checked={this.props.item.completed} onChange={this.toggleItem}/></td>
          <td>{this.state.edit ? editItem : showItem}</td>
          <td><i className="glyphicon glyphicon-remove text-danger" onClick={this.removeItem}></i></td>
        </tr>
      )
    }
  });

  var ToDoFooter = React.createClass({
    propTypes: {
      category: React.PropTypes.string.isRequired,
      activeCount: React.PropTypes.number.isRequired,
      completedCount: React.PropTypes.number.isRequired,
      toggleCategory: React.PropTypes.func.isRequired,
      clearCompleted: React.PropTypes.func.isRequired
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      return this.props !== nextProps;
    },

    toggleCategory: function (category) {
      this.props.toggleCategory(category);
    },

    render: function () {
      var klassForAll       = '',
          klassForActive    = '',
          klassForCompleted = '',
          activeClass       = 'text-success active-category',
          leftCount         = this.props.activeCount == 1 ? '1 item left' : this.props.activeCount + ' items left',
          clearCompelted     = '';

      if (this.props.completedCount > 0) {
        var value      = 'Clear completed (' + this.props.completedCount + ')';
        clearCompelted = <input type="button"
                                className="btn btn-danger btn-xs"
                                onClick={this.props.clearCompleted}
                                value={value}/>
      }

      switch (this.props.category) {
        case 'all':
          klassForAll = activeClass;
          break;
        case 'active':
          klassForActive = activeClass;
          break;
        case 'completed':
          klassForCompleted = activeClass;
          break;
        default:
          break;
      }

      return (
        <footer className="row row-fluid">
          <div className="col-sm-3 item-left">{leftCount}</div>
          <div className="col-sm-6 text-center">
            <ul className="nav nav-pills">
              <li>
                <a className={klassForAll} href="#/all" onClick={this.toggleCategory.bind(this, 'all')}>All</a>
              </li>
              <li>
                <a className={klassForActive}
                   href="#/active"
                   onClick={this.toggleCategory.bind(this, 'active')}>Active</a>
              </li>
              <li>
                <a className={klassForCompleted}
                   href="#/completed"
                   onClick={this.toggleCategory.bind(this, 'completed')}>Completed</a>
              </li>
            </ul>
          </div>
          <div className="col-sm-3">{clearCompelted}</div>
        </footer>
      )
    }
  });

  ReactDOM.render(
    <ToDo />,
    document.getElementById('todo')
  );
})(window.React, window.ReactDOM);
