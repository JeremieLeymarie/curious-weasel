defmodule TimeTrackerWeb.UserController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.UserContext
  alias TimeTracker.UserContext.User

  action_fallback(TimeTrackerWeb.FallbackController)

  def index(conn, params) do
    # TODO: get actual logged in user
    current_user = UserContext.get_user(1)

    users = UserContext.list_users(params, current_user)

    render(conn, :index, users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- UserContext.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/users/#{user}")
      |> render(:show, user: user)
    end
  end

  def sign_user_up(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- UserContext.create_user(user_params),
         {:ok, token, _full_claims} <- TimeTracker.Guardian.encode_and_sign(user) do
      conn
      |> put_status(:created)
      |> json(%{
        id: user.id,
        email: user.email,
        token: token
      })
    end
  end

  def show(conn, %{"id" => id}) do
    case UserContext.get_user(id) do
      nil -> conn |> put_status(:not_found) |> json(%{error: "User not found"})
      user -> render(conn, :show, user: user)
    end
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = UserContext.get_user(id)

    with {:ok, %User{} = user} <- UserContext.update_user(user, user_params) do
      render(conn, :show, user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = UserContext.get_user(id)

    with {:ok, %User{}} <- UserContext.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end

  def sign_in(conn, %{"user" => %{"email" => email, "hash_password" => hash_password}}) do
    case TimeTracker.Guardian.authenticate(email, hash_password) do
      {:ok, user, token} ->
        conn
        |> put_session(:current_user, %{test: "tutut"})
        |> put_status(:ok)
        |> json(%{
          id: user.id,
          email: user.email,
          token: token,
          role: user.role,
          username: user.username
        })

      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{
          error: "invalid credentials"
        })
    end
  end

  def sign_out(conn,  %{"user" => %{"email" => email, "hash_password" => hash_password}}) do
    {:ok, user, token} ->
    conn
    # {:ok, %{message: "Logged out"}} = Guardian.revoke!(conn)
    delete_resp_cookie(token,
    path: "/",
    http_only: true,
    max_age: 1970)
  end
end
