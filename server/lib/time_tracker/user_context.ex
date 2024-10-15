defmodule TimeTracker.UserContext do
  @moduledoc """
  The UserContext context.
  """

  import Ecto.Query, warn: false

  alias TimeTracker.Repo

  alias TimeTracker.UserContext.User

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users(params) do
    filter_email =
      if params["email"] do
        dynamic([p], like(p.email, ^"%#{String.replace(params["email"], "%", "\\%")}%"))
      else
        true
      end

    filter_username =
      if params["username"] do
        dynamic([p], like(p.username, ^"%#{String.replace(params["username"], "%", "\\%")}%"))
      else
        true
      end

    query =
      from(u in User,
        where: ^filter_email,
        where: ^filter_username,
        preload: [:clocks, :working_times]
      )

    Repo.all(query)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user(id), do: Repo.get(User, id)

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    payload = Map.put(attrs, "role", "employee")

    %User{}
    |> User.changeset(payload)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    payload = Map.put(attrs, "role", "employee")

    user
    |> User.changeset(payload)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
 end

end
