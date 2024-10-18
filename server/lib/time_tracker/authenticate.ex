defmodule TimeTracker.Plug.Authenticate do
  import Plug.Conn
  require Logger
  alias TimeTracker.UserContext
  alias TimeTracker.UserContext.User

  def init(opts) do
    opts
  end

  def fake_token_verification(token) do
    # false
    {:ok, UserContext.get_user(1)}
  end

  def call(conn, _opts) do
    with token <- get_session(conn, :token),
         # TODO: implement actual token verification
         {:ok, data} <- TimeTracker.Plug.Authenticate.fake_token_verification(token) do
      conn
      |> assign(:current_user, data)
    else
      error ->
        conn
        |> put_status(:unauthorized)
        |> Phoenix.Controller.json(%{error: "Unauthorized"})
        |> halt()
    end
  end

  def temp_get_current_user do
    # TODO: get actual logged in user
    UserContext.get_user(1)
  end
end
